<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ProductRepository;
use App\Repository\FilterRepository;
use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

class ProductController extends AbstractController
{
    #[Route('/api/admin/products', name: 'list_article_admin')]
    public function listArticleAdmin(ProductRepository $repository)
    {
        $products = $repository->findAll();
        $data = [];
        foreach ($products as $product)
        {
            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'stock' => $product->getStock(),
                'image' => $product->getImage(),
                'description' => $product->getDescription(),
                'weight' => $product->getWeight(),
                'promo' => $product->getPromo(),
                'source' => $product->getSource(),
                'new' => $product->isNew(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/products', name: 'list_article')]
    public function listArticle(ProductRepository $repository)
    {
        $products = $repository->findAll();
        $data = [];
        foreach ($products as $product)
        {
            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'stock' => $product->getStock(),
                'image' => $product->getImage(),
                'description' => $product->getDescription(),
                'weight' => $product->getWeight(),
                'promo' => $product->getPromo(),
                'source' => $product->getSource(),
                'new' => $product->isNew(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/products/create', name: 'new_article')]
    public function createArticle(Request $request, EntityManagerInterface $entity)
    {
        $data = json_decode($request->getContent(), true);
        $product = new Product();
        $product->setName($data['name']);
        $product->setPrice($data['price']);
        $product->setStock($data['stock']);
        $product->setImage($data['image']);
        $product->setDescription($data['description']);
        $product->setWeight($data['weight']);
        $product->setSource($data['source']);
        $product->setNew(true);
        $product->setPromo(0);
        $entity->persist($product);
        $entity->flush();
        return new JsonResponse(['status' => 'Product created'], 201);
    }

    #[Route('/api/products/{id}', name: 'get_product')]
    public function getProduct(ProductRepository $repository, int $id): JsonResponse
    {
        $product = $repository->find($id);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found']);
        }

        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'image' => $product->getImage(),
            'description' => $product->getDescription(),
            'weight' => $product->getWeight(),
            'promo' => $product->getPromo(),
            'source' => $product->getSource(),
            'new' => $product->isNew(),
        ];

        return new JsonResponse($data);
    }

    #[Route('/api/admin/products/modify', name: 'modify_articles')]
    public function modifyArticle(Request $request, EntityManagerInterface $entity, ProductRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $article)
        {
            $product = $repository->find($article['id']);
            if ($product)
            {
                $product->setName($article['name']);
                $product->setDescription($article['description']);
                $product->setStock($article['stock']);
                $product->setWeight($article['weight']);
                $product->setPrice($article['price']);
                $product->setImage($article['image']);
                $product->setSource($article['source']);
                $product->setPromo($article['promo']);
                if ($article['new'] === 'true')
                {
                    $product->setNew(true);
                }
                else
                {
                    $product->setNew(false);
                }
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Products modified', 200]);
    }

    #[Route('/api/admin/products/delete', name: 'delete_articles')]
    public function deleteArticle(Request $request, EntityManagerInterface $entity, ProductRepository $repository, FilterRepository $filter)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $article)
        {
            $product_id = $repository->find($article['id']);
            $filter->findDeleteArticles($article['id']);
            if ($product_id)
            {
                $entity->remove($product_id);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Products deleted', 200]);
    }
}