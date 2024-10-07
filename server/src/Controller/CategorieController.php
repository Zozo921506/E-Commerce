<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\CategorieRepository;
use App\Repository\FilterRepository;
use App\Entity\Categorie;
use App\Repository\ProductRepository;
use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

class CategorieController extends AbstractController
{
    #[Route('/api/admin/categories', name: 'list_categories')]
    public function listCategorie(CategorieRepository $repository)
    {
        $categories = $repository->findAll();
        $data = [];
        foreach ($categories as $categorie)
        {
            $data[] = [
                'id' => $categorie->getId(),
                'name' => $categorie->getName(),
                'description' => $categorie->getDescription(),
                'created_at' => $categorie->getCreatedAt(),
                'update_at' =>$categorie->getUpdateAt(),
                'parent' => $categorie->getParent(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/categories/create', name: 'new_categorie')]
    public function createCategorie(Request $request, EntityManagerInterface $entity)
    {
        $data = json_decode($request->getContent(), true);
        $categorie = new Categorie();
        $categorie->setName($data['name']);
        $categorie->setDescription($data['description']);
        $categorie->setCreatedAt(new \DateTime('now'));
        $categorie->setUpdateAt(new \DateTime('now'));
        $categorie->setParent($data['parent']);
        $entity->persist($categorie);
        $entity->flush();
        return new JsonResponse(['status' => 'Categorie created'], 201);
    }

    #[Route('/api/admin/categories/modify', name: 'modify_categories')]
    public function modifyCategorie(Request $request, EntityManagerInterface $entity, CategorieRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $item)
        {
            $categorie = $repository->find($item['id']);
            if ($categorie)
            {
                $categorie->setName($item['name']);
                $categorie->setDescription($item['description']);
                $categorie->setUpdateAt(new \DateTime('now'));
                $categorie->setParent($item['parent']);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Products modified', 200]);
    }

    #[Route('/api/admin/categories/delete', name: 'delete_categorie')]
    public function deleteCategorie(Request $request, EntityManagerInterface $entity, CategorieRepository $repository, FilterRepository $filter)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $categorie)
        {
            $categorie_id = $repository->find($categorie['id']);
            $filter->findDeleteCategories($categorie['id']);
            if ($categorie_id)
            {
                $entity->remove($categorie_id);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Categoried deleted', 200]);
    }

    #[Route('/api/categories', name: 'main_categories')]
    public function mainCategorie(CategorieRepository $repository)
    {
        $categories = $repository->findAll();
        $data = [];
        foreach ($categories as $categorie)
        {
            if ($categorie->getParent() === "")
            {
                $data[] = [
                    'id' => $categorie->getId(),
                    'name' => $categorie->getName(),
                    'description' => $categorie->getDescription(),
                    'created_at' => $categorie->getCreatedAt(),
                    'update_at' =>$categorie->getUpdateAt(),
                    'parent' => $categorie->getParent(),
                ];
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/categories_sub', name: 'sub_categories')]
    public function subCategorie(CategorieRepository $repository)
    {
        $categories = $repository->findAll();
        $data = [];
        foreach ($categories as $categorie)
        {
            if ($categorie->getParent() != "")
            {
                $data[] = [
                    'id' => $categorie->getId(),
                    'name' => $categorie->getName(),
                    'description' => $categorie->getDescription(),
                    'created_at' => $categorie->getCreatedAt(),
                    'update_at' =>$categorie->getUpdateAt(),
                    'parent' => $categorie->getParent(),
                ];
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/categories_sub/{name}', name: 'sub_categories_breadcrumbs')]
    public function subCategorieBreadCrumbs(CategorieRepository $repository, string $name)
    {
        $categories = $repository->findAll();
        $data = [];
        foreach ($categories as $categorie)
        {
            if ($categorie->getName() === $name)
            {
                $data[] = [
                    'id' => $categorie->getId(),
                    'name' => $categorie->getName(),
                    'description' => $categorie->getDescription(),
                    'created_at' => $categorie->getCreatedAt(),
                    'update_at' =>$categorie->getUpdateAt(),
                    'parent' => $categorie->getParent(),
                ];
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/categories_sub/products/{name}', name: 'sub_categories_products')]
    public function subCategorieProducts(CategorieRepository $repository, string $name, ProductRepository $product, FilterRepository $filter)
    {
        $categories = $repository->findAll();
        $data = [];
        foreach ($categories as $categorie)
        {
            if ($categorie->getName() === $name)
            {
                $id = $categorie->getId();
                $filters = $filter->findAll();
                foreach ($filters as $fil)
                {
                    if ($fil->getIdCategorie() === $id)
                    {
                        $article = $product->find($fil->getIdArticle());
                        $data[] = [
                            'id' => $article->getId(),
                            'name' => $article->getName(),
                            'price' => $article->getPrice(),
                            'image' => $article->getImage(),
                            'promo' => $article->getPromo(),
                            'stock' => $article->getStock(),
                            'new' =>$article->isNew(),
                        ];
                    }
                }
            }
        }
        return new JsonResponse($data);
    }
}