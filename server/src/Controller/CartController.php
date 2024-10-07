<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\SessionInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Token;
use App\Entity\Cart;
use App\Repository\TokenRepository;
use App\Repository\CartRepository;
use App\Repository\CartWeightRepository;
use App\Repository\CommandRepository;
use App\Repository\CountriesTaxesRepository;
use App\Repository\ProductRepository;
use App\Repository\ShippingCostRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class CartController extends AbstractController
{
    #[Route('/api/add/{id}', name: 'add_to_cart')]
    public function add(Request $request, EntityManagerInterface $entity, int $id, TokenRepository $repository)
    {
        $token = $request->headers->get('Authorization');
        if (!$token) 
        {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }
        
        $token = str_replace('Bearer ', '', $token);
        $data = json_decode($request->getContent(), true);
        $quantity = $data['quantity'];
        $logged_users = $repository->findAll();
        foreach ($logged_users as $logged)
        {
            if ($logged->getTokenValue() === $token)
            {
                $id_user = $logged->getIdUser();
            }
        }
        $categorie = new Cart();
        $categorie->setIdCustomer($id_user);
        $categorie->setIdProduct($id);
        $categorie->setQuantity($quantity);
        $entity->persist($categorie);
        $entity->flush();
        return new JsonResponse(['status' => 'Product added to cart'], 201);
    }

    #[Route('/api/cart/nb_articles', name: 'number_in_cart')]
    public function displayNbArticle(Request $request, TokenRepository $repository, CartRepository $cart_article)
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
        $articles = $cart_article->findAll();
        $count = 0;
        foreach ($articles as $article)
        {
            if ($article->getIdCustomer() === $id_user)
            {
                $quantity = $article->getQuantity();
                $count += $quantity;
            }
        }
        return new JsonResponse($count);
    }

    #[Route('/api/cart', name: 'get_cart_items', methods: ['GET'])]
    public function getCartItems(Request $request, TokenRepository $tokenRepository, CartRepository $cartRepository, ProductRepository $productRepository)
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }

        $token = str_replace('Bearer ', '', $token);
        $logged_users = $tokenRepository->findAll();
        $id_user = null;
        foreach ($logged_users as $logged) {
            if ($logged->getTokenValue() === $token) {
                $id_user = $logged->getIdUser();
                break;
            }
        }

        if ($id_user === null) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $cartItems = $cartRepository->findBy(['id_customer' => $id_user]);
        $items = [];

        foreach ($cartItems as $item) {
            $product = $productRepository->find($item->getIdProduct());
            $items[] = [
                'id' => $item->getId(),
                'product' => [
                    'id' => $product->getId(),
                    'name' => $product->getName(),
                    'price' => $product->getPrice(),
                    'image' => $product->getImage(),
                    'source' => $product->getSource(),
                    'promo' => $product->getPromo(),
                    'weight'=>$product->getWeight()
                ],
                'quantity' => $item->getQuantity()
            ];
        }

        return new JsonResponse($items);
    }

    #[Route('/api/cart_total', name: 'get_cart_total', methods: ['GET'])]
    public function getCartTotal(Request $request, TokenRepository $tokenRepository, CartRepository $cartRepository, ProductRepository $productRepository)
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

        $cartItems = $cartRepository->findBy(['id_customer' => $id_user]);
        $total = 0;

        foreach ($cartItems as $item) 
        {
            $products = $productRepository->findAll();
            $id_article = $item->getIdProduct();
            foreach ($products as $product)
            {
                if ($product->getId() === $id_article)
                {
                    $price = $product->getPrice();
                    $quantity = $item->getQuantity();
                    $promo = $product->getPromo();
                    if ($promo === 0)
                    {
                        $total += $price * $quantity;
                    }
                    else
                    {
                        $total += ($price - $price * $promo / 100) * $quantity;
                    }
                }
            }
        }

        return new JsonResponse($total);
    }

    #[Route('/api/cart_weight', name: 'get_cart_weight')]
    public function getCartWeight(Request $request, TokenRepository $tokenRepository, CartRepository $cartRepository, ProductRepository $productRepository)
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

        $cartItems = $cartRepository->findBy(['id_customer' => $id_user]);
        $total = 0;

        foreach ($cartItems as $item)
        {
            $products = $productRepository->findAll();
            $id_article = $item->getIdProduct();
            foreach ($products as $product)
            {
                if ($product->getId() === $id_article)
                {
                    $weight = $product->getWeight();
                    $quantity = $item->getQuantity();
                    $total += $weight * $quantity;
                }
            }
        }
        $total = round($total, 3);

        return new JsonResponse($total);
    }

    #[Route('/api/payment_weight/{session_id}', name: 'get_payment_weight')]
    public function getPaymentWeight(CommandRepository $repository, $session_id)
    {
        $total = 0;
        $commands = $repository->findAll();
        foreach ($commands as $command)
        {
            if ($command->getIdSession() === $session_id)
            {
                $weight = $command->getWeight();
                $quantity = $command->getQuantity();
                $total += $weight * $quantity;
            }
        }
        $total = round($total, 3);

        return new JsonResponse($total);
    }

    #[Route('/api/cart_size/{weight}', name: 'get_cart_weight_price')]
    public function getCartWeightPrice(CartWeightRepository $repository, float $weight)
    {
        $weight_list = $repository->findAll(); 
        foreach ($weight_list as $taxe)
        {
            if ($weight >= $taxe->getMinWeight() && $weight < $taxe->getMaxWeight())
            {
                $price = $taxe->getPrice();
                return new JsonResponse($price);
            }
        }
        return new JsonResponse(['error' => "Couldn't find a price"], 404);
    }


    #[Route('/api/cart/{id}', name: 'remove_cart_item', methods: ['DELETE'])]
    public function removeCartItem(int $id, TokenRepository $tokenRepository, CartRepository $cartRepository, Request $request, EntityManagerInterface $entityManager)
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            throw new UnauthorizedHttpException('Bearer', 'No token provided');
        }

        $token = str_replace('Bearer ', '', $token);
        $logged_users = $tokenRepository->findAll();
        $id_user = null;
        foreach ($logged_users as $logged) {
            if ($logged->getTokenValue() === $token) {
                $id_user = $logged->getIdUser();
                break;
            }
        }

        if ($id_user === null) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $cartItem = $cartRepository->find($id);
        if (!$cartItem || $cartItem->getIdCustomer() !== $id_user) {
            return new JsonResponse(['error' => 'Item not found or does not belong to user'], 404);
        }

        $entityManager->remove($cartItem);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Item removed from cart'], 200);
    }

    #[Route('/api/cart/delivery', name: 'get_cart_delivery')]
    public function getCartDelivery(Request $request, ShippingCostRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        $taxe = $repository->findPrice($data['name'], $data['delivery']);
        return new JsonResponse($taxe);
    }

    #[Route ('/api/cart/source_taxe', name: 'cart_source_taxe')]
    public function getCartSource(Request $request, CountriesTaxesRepository $repository, TokenRepository $tokenRepository, CommandRepository $commandRepository, ProductRepository $productRepository)
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
        $commands = $commandRepository->findBy(['id_user' => $id_user]);
        $data = json_decode($request->getContent(), true);
        $taxe = 0;
        foreach ($commands as $command)
        {
            $product = $productRepository->find($command->getIdProduct());
            $source_taxe = $repository->findSourcePrice($product->getSource(), $data['name']);
            $taxe += $source_taxe;
        }
        return new JsonResponse($taxe);
    }

    #[Route ('/api/payment/source_taxe/{session_id}', name: 'payment_source_taxe')]
    public function getPaymentSource(Request $request, CountriesTaxesRepository $repository, CommandRepository $commandRepository, $session_id)
    {
        $commands = $commandRepository->findAll();
        $data = json_decode($request->getContent(), true);
        $taxe = 0;
        foreach ($commands as $command)
        {
            if ($command->getIdSession() === $session_id)
            {
                $source_taxe = $repository->findSourcePrice($command->getSource(), $data['name']);
                $taxe += $source_taxe;
            }
        }
        return new JsonResponse($taxe);
    }

}
