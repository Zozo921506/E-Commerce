<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\CommandRepository;
use App\Entity\Command;
use App\Entity\PaymentInfo;
use App\Entity\PurchaseOrder;
use App\Entity\SaveEmail;
use App\Repository\CartRepository;
use App\Repository\PaymentInfoRepository;
use App\Repository\ProductRepository;
use App\Repository\PurchaseOrderRepository;
use App\Repository\SaveEmailRepository;
use App\Repository\TokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class PaymentController extends AbstractController
{
    #[Route('/api/product/payment_token', name: 'create_command_token')]
    public function createCommandToken(Request $request, EntityManagerInterface $entity, TokenRepository $repository)
    {
        $token = $request->headers->get('Authorization');
        if (!$token)
        {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }

        $token = str_replace('Bearer ', '', $token);
        $logged_users = $repository->findAll();
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
        $command = new Command();
        $command->setIdUser($id_user);
        $command->setPrice($data['price']);
        $command->setWeight($data['weight']);
        $command->setQuantity($data['quantity']);
        $command->setSource($data['source']);
        $command->setIdProduct($data['id_product']);
        $entity->persist($command);
        $entity->flush();
        return new JsonResponse(['status' => 'Command created'], 201);
    }

    #[Route('/api/cart/payment_token', name: 'create_cart_command_token')]
    public function createCartCommandToken(Request $request, EntityManagerInterface $entity, TokenRepository $repository)
    {
        $token = $request->headers->get('Authorization');
        if (!$token)
        {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }

        $token = str_replace('Bearer ', '', $token);
        $logged_users = $repository->findAll();
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
        $items = $data['items'] ?? [];
        foreach ($items as $item)
        {
            $command = new Command();
            $command->setIdUser($id_user);
            $command->setPrice($item['price']);
            $command->setWeight($item['weight']);
            $command->setQuantity($item['quantity']);
            $command->setSource($item['source']);
            $command->setIdProduct($item['id_product']);
            $entity->persist($command);
            $entity->flush();
        }
        return new JsonResponse(['status' => 'Command created'], 201);
    }

    #[Route('/api/product/payment', name: 'create_command')]
    public function createCommand(Request $request, EntityManagerInterface $entity)
    {
        $data = json_decode($request->getContent(), true);
        $command = new Command();
        $command->setIdSession($data['id_session']);
        $command->setPrice($data['price']);
        $command->setWeight($data['weight']);
        $command->setQuantity($data['quantity']);
        $command->setSource($data['source']);
        $command->setIdProduct($data['id_product']);
        $entity->persist($command);
        $entity->flush();
        return new JsonResponse(['status' => 'Command created'], 201);
    }

    #[Route('/api/product/payment_token/delete', name: 'delete_command_token')]
    public function deleteCommandToken(Request $request, EntityManagerInterface $entity, CommandRepository $repository, TokenRepository $tokenRepository)
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

        $commands = $repository->findAll();
        foreach ($commands as $command)
        {
            if ($command->getIdUser() === $id_user)
            {
                $entity->remove($command);
            }
        }
        $entity->flush();
        return new JsonResponse(['status' => 'Command removed'], 200);
    }

    #[Route('/api/product/payment/delete/{session_id}', name: 'delete_command')]
    public function deleteCommand(Request $request, EntityManagerInterface $entity, CommandRepository $repository, $session_id)
    {
        $commands = $repository->findAll();
        foreach ($commands as $command)
        {
            if ($command->getIdSession() === $session_id)
            {
                $entity->remove($command);
                $entity->flush();
            }
        }
        return new JsonResponse(['status' => 'Command removed'], 200);
    }

    #[Route('/api/payment_token_display_price', name: 'command_token_price')]
    public function displayCommandPriceToken(Request $request, TokenRepository $repository, CommandRepository $commandRepository)
    {
        $token = $request->headers->get('Authorization');
        if (!$token) 
        {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }
        
        $token = str_replace('Bearer ', '', $token);
        $logged_users = $repository->findAll();
        foreach ($logged_users as $logged)
        {
            if ($logged->getTokenValue() === $token)
            {
                $id_user = $logged->getIdUser();
            }
        }

        $commands = $commandRepository->findAll();
        $count = 0;
        foreach ($commands as $command)
        {
            if ($command->getIdUser() === $id_user)
            {
                $price = $command->getPrice();
                $count += $price;
            }
        }
        return new JsonResponse($count);
    }

    #[Route('/api/payment_display_price/{session_id}', name: 'command_price')]
    public function displayCommandPrice(Request $request, CommandRepository $repository, $session_id)
    {
        $commands = $repository->findAll();
        $count = 0;
        foreach ($commands as $command)
        {
            if ($command->getIdSession() === $session_id)
            {
                $price = $command->getPrice();
                $count += $price;
            }
        }
        return new JsonResponse($count);
    }

    #[Route('/api/payment/get_product_id/{id_session}', name: 'payment_get_product_id')]
    public function getProductId(CommandRepository $repository, $id_session)
    {
        $products = $repository->findAll();
        foreach ($products as $product)
        {
            if ($id_session === $product->getIdSession())
            {
                $product_id = $product->getIdProduct();
                return new JsonResponse($product_id);
            }
        }
        return new JsonResponse(['error' => 'Product not found'], 404);
    }

    #[Route('/api/payment/get_product_id_token', name: 'payment_get_product_id_token')]
    public function getProductIdToken(Request $request, TokenRepository $tokenRepository, CommandRepository $repository)
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

        $products = $repository->findAll();
        $data = [];
        foreach ($products as $product)
        {
            if ($id_user === $product->getIdUser())
            {
                $data[] = [
                    'id_product'=>$product->getIdProduct()
                ];
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/payment/remove_article', name: 'reduce_article')]
    public function reduceArticle(Request $request, EntityManagerInterface $entity, CommandRepository $repository, ProductRepository $productRepository)
    {
        $data = json_decode($request->getContent(), true);
        $commands = $repository->findAll();
        $articles = $productRepository->findAll();
        foreach ($commands as $command)
        {
            foreach ($articles as $article)
            {
                if ($command->getIdSession() === $data['session_id'] && $article->getId() === $command->getIdProduct())
                {
                    $new_value = $article->getStock() - $command->getQuantity();
                    $article->setStock($new_value);
                }
            }
        }
        $entity->flush();
        return new JsonResponse(['status' => 'Products modified', 200]);
    }

    #[Route('/api/payment/remove_article_token', name: 'reduce_article_token')]
    public function reduceArticleToken(Request $request, EntityManagerInterface $entity, CommandRepository $repository, TokenRepository $tokenRepository, ProductRepository $productRepository, CartRepository $cartRepository)
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

        $commands = $repository->findAll();
        $articles = $productRepository->findAll();
        foreach ($commands as $command)
        {
            foreach ($articles as $article)
            {
                if ($id_user === $command->getIdUser() && $article->getId() === $command->getIdProduct())
                {
                    $new_value = $article->getStock() - $command->getQuantity();
                    $article->setStock($new_value);
                }
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Products modified', 200]);
    }

    #[Route('/api/product/payment/delete_cart', name: 'payment_remove_cart_items')]
    public function removeCartItems(Request $request, EntityManagerInterface $entity, CartRepository $repository, TokenRepository $tokenRepository)
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

        $articles = $repository->findAll();
        foreach ($articles as $article)
        {
            if ($article->getIdCustomer() === $id_user)
            {
                $entity->remove($article);
            }
        }
        $entity->flush();
        return new JsonResponse(['status' => 'Cart removed'], 200);
    }

    #[Route('/api/payment/order_number', name: 'create_purchase_order')]
    public function createPurchaseOrder(Request $request, EntityManagerInterface $entity, CommandRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        $commands = $repository->findAll();
        foreach ($commands as $command)
        {
            if ($command->getIdSession() === $data['id_session'])
            {
                $price = $command->getPrice() + $data['delivery'];
                $purchase_order = new PurchaseOrder();
                $purchase_order->setIdSession($data['id_session']);
                $purchase_order->setPrice($price);
                $purchase_order->setOrderNumber($data['order_number']);
                $purchase_order->setQuantity($command->getQuantity());
                $purchase_order->setIdProduct($command->getIdProduct());
                $purchase_order->setAdress($data['adress']);
                $purchase_order->setStatus('ongoing');
                $purchase_order->setGiftPaper($data['gift']);
                $entity->persist($purchase_order);
            }
        }
        $entity->flush();
        return new JsonResponse(['status' => 'Command created'], 201);
    }

    #[Route('/api/payment/order_number_token', name: 'create_purchase_order_token')]
    public function createPurchaseOrderToken(Request $request, EntityManagerInterface $entity, CommandRepository $repository, TokenRepository $tokenRepository)
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
        $order_number = $data['order_number']. $id_user;
        $commands = $repository->findAll();
        foreach ($commands as $command)
        {
            if ($command->getIdUser() === $id_user)
            {
                $price = $command->getPrice() + $data['delivery'];
                $purchase_order = new PurchaseOrder();
                $purchase_order->setIdUser($id_user);
                $purchase_order->setPrice($price);
                $purchase_order->setOrderNumber($order_number);
                $purchase_order->setQuantity($command->getQuantity());
                $purchase_order->setIdProduct($command->getIdProduct());
                $purchase_order->setAdress($data['adress']);
                $purchase_order->setStatus('ongoing');
                $purchase_order->setGiftPaper($data['gift']);
                $entity->persist($purchase_order);
            }
        }
        $entity->flush();
        return new JsonResponse(['status' => 'Command created'], 201);
    }

    #[Route('/api/purchase_order/{id_session}', name: 'display_purchase_order')]
    public function displayPurchaseOrder(PurchaseOrderRepository $repository, ProductRepository $productRepository, $id_session)
    {
        $purchase_orders = $repository->findAll();
        $data = [];
        $products = $productRepository->findAll();
        foreach ($purchase_orders as $purchase_order)
        {
            foreach ($products as $product)
            {
                if ($purchase_order->getIdSession() === $id_session && $product->getId() === $purchase_order->getIdProduct())
                {
                    $data[] = [
                        'id' => $purchase_order->getId(),
                        'order_number' => $purchase_order->getOrderNumber(),
                        'name' => $product->getName(),
                        'quantity' => $purchase_order->getQuantity(),
                        'price' => $purchase_order->getPrice(),
                        'status' => $purchase_order->getStatus(),
                        'adress' => $purchase_order->getAdress(),
                        'gift' => $purchase_order->getGiftPaper(),
                    ];
                }
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/purchase_order', name: 'display_purchase_order/token')]
    public function displayPurchaseOrderToken(Request $request, PurchaseOrderRepository $repository, ProductRepository $productRepository, TokenRepository $tokenRepository)
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

        $purchase_orders = $repository->findAll();
        $data = [];
        $products = $productRepository->findAll();
        foreach ($purchase_orders as $purchase_order)
        {
            foreach ($products as $product)
            {
                if ($purchase_order->getIdUser() === $id_user && $product->getId() === $purchase_order->getIdProduct())
                {
                    $data[] = [
                        'id' => $purchase_order->getId(),
                        'order_number' => $purchase_order->getOrderNumber(),
                        'name' => $product->getName(),
                        'quantity' => $purchase_order->getQuantity(),
                        'price' => $purchase_order->getPrice(),
                        'status' => $purchase_order->getStatus(),
                        'adress' => $purchase_order->getAdress(),
                        'gift' => $purchase_order->getGiftPaper(),
                    ];
                }
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/payment/save_info', name: 'save_payment_info')]
    public function savePaymentInfo(Request $request, EntityManagerInterface $entity, PaymentInfoRepository $repository, TokenRepository $tokenRepository)
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
        $infos = $repository->findAll();
        foreach ($infos as $info)
        {
            if ($info->getIdUser() === $id_user)
            {
                $info->setFirstname($data['firstname']);
                $info->setLastname($data['lastname']);
                $info->setCity($data['city']);
                $info->setZipcode($data['zipcode']);
                $info->setAdress($data['adress']);
                $info->setCreditCardNumber($data['creditCard']);
                $entity->persist($info);
                $entity->flush();
                return new JsonResponse(['status' => 'Infos created'], 201);
            }
        }

        $save_infos = new PaymentInfo();
        $save_infos->setIdUser($id_user);
        $save_infos->setFirstname($data['firstname']);
        $save_infos->setLastname($data['lastname']);
        $save_infos->setCity($data['city']);
        $save_infos->setZipcode($data['zipcode']);
        $save_infos->setAdress($data['adress']);
        $save_infos->setCreditCardNumber($data['creditCard']);
        $entity->persist($save_infos);
        $entity->flush();
        return new JsonResponse(['status' => 'Infos created'], 201);
    }

    #[Route('/api/payment/get_payment_info', name: 'display_payment_infos')]
    public function displayPaymentInfo(Request $request, PaymentInfoRepository $repository, TokenRepository $tokenRepository)
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

        $payment_infos = $repository->findAll();
        $data = [];
        foreach ($payment_infos as $payment_info)
        {
            if ($payment_info->getIdUser() === $id_user)
            {
                $data[] = [
                    'id' => $payment_info->getId(),
                    'firstname' => $payment_info->getFirstname(),
                    'lastname' => $payment_info->getLastname(),
                    'city' => $payment_info->getCity(),
                    'zipcode' => $payment_info->getZipcode(),
                    'adress' => $payment_info->getAdress(),
                    'creditCard'=> $payment_info->getCreditCardNumber(),
                ];
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/payment/save_email/{id_session}', name: 'save_payment_email')]
    public function saveEmail(Request $request, EntityManagerInterface $entity, SaveEmailRepository $repository, $id_session)
    {
        $data = json_decode($request->getContent(), true);
        $infos = $repository->findAll();
        foreach ($infos as $info)
        {
            if ($info->getIdSession() === $id_session)
            {
                $info->setIdSession($id_session);
                $info->setEmail($data['email']);
                $entity->persist($info);
                $entity->flush();
                return new JsonResponse(['status' => 'Infos created'], 201);
            }
        }

        $save_infos = new SaveEmail();
        $save_infos->setIdSession($id_session);
        $save_infos->setEmail($data['email']);
        $entity->persist($save_infos);
        $entity->flush();
        return new JsonResponse(['status' => 'Infos created'], 201);
    }
}