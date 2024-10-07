<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Entity\Token;
use App\Repository\AdminRepository;
use App\Repository\ProductRepository;
use App\Repository\PurchaseOrderRepository;
use App\Repository\SaveEmailRepository;
use App\Repository\TokenRepository;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserController extends AbstractController
{
    #[Route('/api/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['firstname'], $data['lastname'], $data['birthday'], $data['email'], $data['password'])) {
            return new JsonResponse(['error' => 'Missing parameters'], 400);
        }

        $user = new User();
        $user->setFirstname($data['firstname']);
        $user->setLastname($data['lastname']);
        $user->setBirthday(new \DateTime($data['birthday']));
        $user->setEmail($data['email']);
        $user->setPassword(hash('sha256', $data['password']));

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['status' => 'User created'], 201);
    }

    #[Route('/api/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, EntityManagerInterface $entity, TokenRepository $repository, AdminRepository $adminRepository)
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'])) {
            return new JsonResponse(['error' => 'Missing parameters'], 400);
        }

        $email = $data['email'];
        $password = hash('sha256', $data['password']);

        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user && $user->getPassword() === $password) {
            $id = $user->getId();
            $token = bin2hex(random_bytes(16));
            $existedToken = $repository->findAll();
            foreach ($existedToken as $tokenFound)
            {
                if ($tokenFound->getIdUser() === $id)
                {
                    $entity->remove($tokenFound);
                    $entity->flush();
                }
            }
            $addToken = new Token();
            $addToken->setIdUser((int)$id);
            $addToken->setTokenValue($token);
            $addToken->setCreateAt(new \DateTime('now'));
            $entity->persist($addToken);
            $entity->flush();
            $admins = $adminRepository->findAll();
            foreach ($admins as $admin)
            {
                if ($id === $admin->getIdUser())
                {
                    $logged_admin = true;
                    return new JsonResponse(['status' => 'Login successful', 'token' => $token, 'admin' => $logged_admin], 200);
                }
            }
            return new JsonResponse(['status' => 'Login successful', 'token' => $token], 200);
        }

        return new JsonResponse(['status' => 'Invalid credentials'], 401);
    }

    #[Route('/api/admin/checkout', name: 'checkout_admin')]
    public function checkAdmin(Request $request, AdminRepository $adminRepository, TokenRepository $tokenRepository)
    {
        $token = $request->headers->get('Authorization');
        if (!$token)
        {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }

        $token = str_replace('Bearer ', '', $token);
        $logged_users = $tokenRepository->findAll();
        $id_user = null;
        foreach ($logged_users as $logged)
        {
            if ($logged->getTokenValue() === $token)
            {
                $id_user = $logged->getIdUser();
                break;
            }
        }

        if ($id_user === null)
        {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $logged_admin = false;
        $admins = $adminRepository->findAll();
        foreach ($admins as $admin)
        {
            if ($id_user === $admin->getIdUser())
            {
                $logged_admin = true;
                return new JsonResponse($logged_admin);
            }
        }
        return new JsonResponse($logged_admin);
    }

    #[Route('/api/admin/purchase_order', name: 'get_users_purchases')]
    public function userPurchases(Request $request, TokenRepository $tokenRepository, PurchaseOrderRepository $repository, UserRepository $userRepository, ProductRepository $productRepository, SaveEmailRepository $saveEmailRepository)
    {
        $token = $request->headers->get('Authorization');
        if (!$token)
        {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }

        $token = str_replace('Bearer ', '', $token);
        $logged_users = $tokenRepository->findAll();
        $id_user = null;
        foreach ($logged_users as $logged)
        {
            if ($logged->getTokenValue() === $token)
            {
                $id_user = $logged->getIdUser();
                break;
            }
        }

        if ($id_user === null)
        {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $data = [];
        $purchase_orders = $repository-> findAll();
        foreach ($purchase_orders as $purchase_order)
        {
            if ($purchase_order->getIdUser() !== null && $purchase_order->getStatus() !== 'delivered')
            {
                $user = $userRepository->find($purchase_order->getIdUser());
                $product = $productRepository->find($purchase_order->getIdProduct());
                $data[] = [
                    'id' => $purchase_order->getId(),
                    'order_number' => $purchase_order->getOrderNumber(),
                    'email' => $user->getEmail(),
                    'product' => $product->getName(),
                    'quantity' => $purchase_order->getQuantity(),
                    'price' => $purchase_order->getPrice(),
                    'gift' => $purchase_order->getGiftPaper(),
                    'status' => $purchase_order->getStatus(),
                ];
            }
            elseif ($purchase_order->getIdSession() !== null && $purchase_order->getStatus() !== 'delivered')
            {
                $product = $productRepository->find($purchase_order->getIdProduct());
                $email = $saveEmailRepository->findOneBy(array('id_session' => $purchase_order->getIdSession()));
                $data[] = [
                    'id' => $purchase_order->getId(),
                    'order_number' => $purchase_order->getOrderNumber(),
                    'email' => $email->getEmail(),
                    'product' => $product->getName(),
                    'quantity' => $purchase_order->getQuantity(),
                    'price' => $purchase_order->getPrice(),
                    'gift' => $purchase_order->getGiftPaper(),
                    'status' => $purchase_order->getStatus(),
                ];
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/update_order_status', name: 'update_order_status', methods: ['PUT'])]
    public function updateOrderStatus(Request $request, EntityManagerInterface $entityManager, PurchaseOrderRepository $purchaseOrderRepository)
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['order_number'], $data['status']))
        {
            return new JsonResponse(['error' => 'Missing parameters'], 400);
        }

        $orderNumber = $data['order_number'];
        $newStatus = $data['status'];
        $purchaseOrders = $purchaseOrderRepository->findBy(['order_number' => $orderNumber]);

        if (!$purchaseOrders)
        {
            return new JsonResponse(['error' => 'Order not found'], 404);
        }

        foreach ($purchaseOrders as $purchaseOrder)
        {
            $purchaseOrder->setStatus($newStatus);
        }

        $entityManager->flush();

        return new JsonResponse(['status' => 'Orders updated successfully'], 200);
    }

    #[Route('/api/get_user_infos', name: 'get_user_infos')]
    public function getUserInfos(Request $request, TokenRepository $tokenRepository, UserRepository $repository)
    {
        $token = $request->headers->get('Authorization');
        if (!$token)
        {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }

        $token = str_replace('Bearer ', '', $token);
        $logged_users = $tokenRepository->findAll();
        $id_user = null;
        foreach ($logged_users as $logged)
        {
            if ($logged->getTokenValue() === $token)
            {
                $id_user = $logged->getIdUser();
                break;
            }
        }

        if ($id_user === null)
        {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $data = [];
        $infos = $repository->findAll();
        foreach ($infos as $info)
        {
            if ($info->getId() === $id_user)
            {
                $data[] = [
                    'id' =>$info->getId(),
                    'firstname' => $info->getFirstname(),
                    'lastname' => $info->getLastname(),
                    'birthday' => $info->getBirthday(),
                    'email' => $info->getEmail(),
                ];
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/update_user_infos', name: 'update_user_infos')]
    public function updateUserInfos(Request $request, TokenRepository $tokenRepository, UserRepository $repository, EntityManagerInterface $entity)
    {
        $token = $request->headers->get('Authorization');
        if (!$token)
        {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }

        $token = str_replace('Bearer ', '', $token);
        $logged_users = $tokenRepository->findAll();
        $id_user = null;
        foreach ($logged_users as $logged)
        {
            if ($logged->getTokenValue() === $token)
            {
                $id_user = $logged->getIdUser();
                break;
            }
        }

        if ($id_user === null)
        {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $users = $repository->findAll();
        foreach ($users as $user)
        {
            if ($user->getId() === $id_user)
            {
                $user->setEmail($data['email']);
                if (isset($data['password']))
                {
                    $user->setPassword(hash('sha256', $data['password']));
                }
                $entity->flush();
            }
        }
        return new JsonResponse(['status' => 'No user found', 400]);
    }
}