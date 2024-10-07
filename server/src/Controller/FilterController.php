<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\FilterRepository;
use App\Entity\Filter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

class FilterController extends AbstractController
{
    #[Route('/api/admin/filter', name: 'list_filter')]
    public function listCategorie(FilterRepository $repository)
    {
        $filters = $repository->findAll();
        $data = [];
        foreach ($filters as $filter)
        {
            $categorie_name = $repository->findCategorieName($filter->getIdCategorie());
            $article_name = $repository->findArticleName($filter->getIdArticle());
            $data[] = [
                'id' => $filter->getId(),
                'categorie_name' => $categorie_name,
                'article_name' => $article_name
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/filter/create', name: 'new_filter')]
    public function createFilter(Request $request, EntityManagerInterface $entity, FilterRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        $id_categorie = $repository->findIdCategorie($data['categorie_name']);
        $id_article = $repository->findIdArticles($data['article_name']);
        $filter = new Filter();
        $filter->setIdCategorie($id_categorie);
        $filter->setIdArticle($id_article);
        $entity->persist($filter);
        $entity->flush();
        return new JsonResponse(['status' => 'Filter created'], 201);
    }

    #[Route('/api/admin/filter/modify', name: 'modify_categories')]
    public function modifyCategorie(Request $request, EntityManagerInterface $entity, FilterRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $item)
        {
            $filter = $repository->find($item['id']);
            if ($filter)
            {
                $filter->setIdCategorie($repository->findIdCategorie($item['categorie_name']));
                $filter->setIdArticle($repository->findIdArticles($item['article_name']));
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Filter modified', 200]);
    }

    #[Route('/api/admin/filter/delete', name: 'delete_filter')]
    public function deleteFilter(Request $request, EntityManagerInterface $entity, FilterRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $filter)
        {
            $filter_id = $repository->find($filter['id']);
            if ($filter_id)
            {
                $entity->remove($filter_id);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Filter deleted', 200]);
    }

    #[Route('/api/filter/{id}', name: 'breadcrumbs')]
    public function BreadCrumbs(FilterRepository $repository, int $id)
    {
        $filters = $repository->findAll();
        $data = [];
        foreach ($filters as $filter) {
            if ($filter->getIdArticle() === $id)
            {
                $article_name = $repository->findArticleName($filter->getIdArticle());
                $categorie_name = $repository->findCategorieName($filter->getIdCategorie());
                $data[] = [
                    'categorie_name' => $categorie_name,
                    'article_name' => $article_name,
                ];
            }
        }

        return new JsonResponse($data);
    }
}