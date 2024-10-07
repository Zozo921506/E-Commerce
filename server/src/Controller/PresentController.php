<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\PresentRepository;
use App\Entity\Present;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

class PresentController extends AbstractController
{
    #[Route('/api/admin/present', name: 'admin_present')]
    public function presentAdmin(PresentRepository $repository)
    {
        $presents = $repository->findAll();
        $data = [];
        foreach ($presents as $present)
        {
            $data[] = [
                'id' => $present->getId(),
                'name' => $present->getName(),
                'price' => $present->getPrice(),
                'image' => $present->getImage(),
                'description' => $present->getDescription(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/present/create', name: 'present_create')]
    public function presentCreate(Request $request, EntityManagerInterface $entity)
    {
        $data = json_decode($request->getContent(), true);
        $product = new Present();
        $product->setName($data['name']);
        $product->setPrice($data['price']);
        $product->setImage($data['image']);
        $product->setDescription($data['description']);
        $entity->persist($product);
        $entity->flush();
        return new JsonResponse(['status' => 'Present created'], 201);
    }

    #[Route('/api/admin/present/modify', name: 'modify_present')]
    public function modifyArticle(Request $request, EntityManagerInterface $entity, PresentRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $gift)
        {
            $present = $repository->find($gift['id']);
            if ($present)
            {
                $present->setName($gift['name']);
                $present->setDescription($gift['description']);
                $present->setPrice($gift['price']);
                $present->setImage($gift['image']);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Products modified', 200]);
    }

    #[Route('/api/admin/present/delete', name: 'delete_present')]
    public function deleteArticle(Request $request, EntityManagerInterface $entity, PresentRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $present)
        {
            $present_id = $repository->find($present['id']);
            if ($present_id)
            {
                $entity->remove($present_id);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Products deleted', 200]);
    }

    #[Route('/api/payment/paper_gift', name: 'get_paper_gift')]
    public function paperGift(PresentRepository $repository)
    {
        $presents = $repository->findAll();
        $data = [];
        foreach ($presents as $present)
        {
            $data[] = [
                'id' => $present->getId(),
                'name' => $present->getName(),
                'price' => $present->getPrice(),
                'image' => $present->getImage(),
                'description' => $present->getDescription(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/payment/gift_taxe/{present_taxe}', name: 'get_gift_taxe')]
    public function giftTaxe(PresentRepository $repository, $present_taxe)
    {
        $presents = $repository->findAll();
        $taxe = 0;
        foreach ($presents as $present)
        {
            if ($present->getName() === $present_taxe)
            {
                $taxe += $present->getPrice();
            }
        }
        return new JsonResponse($taxe);
    }

    #[Route('/api/payment/gift_image/{present_taxe}', name: 'get_gift_img')]
    public function giftImage(PresentRepository $repository, $present_taxe)
    {
        $presents = $repository->findAll();
        $img = '';
        foreach ($presents as $present)
        {
            if ($present->getName() === $present_taxe)
            {
                $img = $present->getImage();
            }
        }
        return new JsonResponse($img);
    }
}
