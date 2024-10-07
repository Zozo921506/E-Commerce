<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ShippingCostRepository;
use App\Entity\ShippingCost;
use App\Entity\CartWeight;
use App\Entity\CountriesTaxes;
use App\Repository\CartWeightRepository;
use App\Repository\CountriesTaxesRepository;
use Doctrine\ORM\EntityManagerInterface;

class ShippingCostController extends AbstractController
{
    #[Route('/api/admin/shipping', name: 'list_shipping_admin')]
    public function listShipping(ShippingCostRepository $repository)
    {
        $shippings = $repository->findAll();
        $data = [];
        foreach ($shippings as $shipping)
        {
            $data[] = [
                'id' => $shipping->getId(),
                'name' => $shipping->getName(),
                'delivery' => $shipping->getDelivery(),
                'taxes' => $shipping->getTaxes(),
                'authorization' => $shipping->isAuthorization()
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/shipping/create', name: 'create_shipping_cost')]
    public function shippingCreate(Request $request, EntityManagerInterface $entity)
    {
        $data = json_decode($request->getContent(), true);
        $shipping = new ShippingCost();
        if ($data['authorization'] === 'whitelist')
        {
            $shipping->setName($data['name']);
            $shipping->setDelivery($data['delivery']);
            $shipping->setTaxes($data['taxes']);
            $shipping->setAuthorization(true);
            $entity->persist($shipping);
            $entity->flush();
            return new JsonResponse(['status' => 'Shipping cost created'], 201);
        }
        else
        {
            $shipping->setName($data['name']);
            $shipping->setDelivery($data['delivery']);
            $shipping->setTaxes($data['taxes']);
            $shipping->setAuthorization(false);
            $entity->persist($shipping);
            $entity->flush();
            return new JsonResponse(['status' => 'Shipping cost created'], 201);
        }
    }

    #[Route('/api/admin/shipping/modify', name: 'modify_shipping')]
    public function modifyShipping(Request $request, EntityManagerInterface $entity, ShippingCostRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $item)
        {
            $shipping = $repository->find($item['id']);
            if ($shipping)
            {
                $shipping->setName($item['name']);
                $shipping->setDelivery($item['delivery']);
                $shipping->setTaxes($item['taxes']);
                if ($item['authorization'] === 'true')
                {
                    $shipping->setAuthorization(true);
                }
                else
                {
                    $shipping->setAuthorization(false);
                }
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Shipping cost modified', 200]);
    }

    #[Route('/api/admin/shipping/delete', name: 'delete_shipping')]
    public function deleteShipping(Request $request, EntityManagerInterface $entity, ShippingCostRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $shipping)
        {
            $shipping_id = $repository->find($shipping['id']);
            if ($shipping_id)
            {
                $entity->remove($shipping_id);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Shipping cost deleted', 200]);
    }
    
    #[Route('/api/admin/weight', name: 'list_weight')]
    public function listWeight(CartWeightRepository $repository)
    {
        $weights = $repository->findAll();
        $data = [];
        foreach ($weights as $weight)
        {
            $data[] = [
                'id' => $weight->getId(),
                'min_weight' => $weight->getMinWeight(),
                'max_weight' => $weight->getMaxWeight(),
                'price' => $weight->getPrice()
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/weight/create', name: 'create_weight')]
    public function weightCreate(Request $request, EntityManagerInterface $entity)
    {
        $data = json_decode($request->getContent(), true);
        $weight = new CartWeight();
        $weight->setMinWeight($data['min_weight']);
        $weight->setMaxWeight($data['max_weight']);
        $weight->setPrice($data['price']);
        $entity->persist($weight);
        $entity->flush();
        return new JsonResponse(['status' => 'Weight taxes cost created'], 201);
    }

    #[Route('/api/admin/weight/modify', name: 'modify_weight')]
    public function modifySWeight(Request $request, EntityManagerInterface $entity, CartWeightRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $item)
        {
            $weight= $repository->find($item['id']);
            if ($weight)
            {
                $weight->setMinWeight($item['min_weight']);
                $weight->setMaxWeight($item['max_weight']);
                $weight->setPrice($item['price']);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Weight taxes modified', 200]);
    }

    #[Route('/api/admin/weight/delete', name: 'delete_weight')]
    public function deleteWeight(Request $request, EntityManagerInterface $entity, CartWeightRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $weight)
        {
            $weight_id = $repository->find($weight['id']);
            if ($weight_id)
            {
                $entity->remove($weight_id);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Weight taxes deleted', 200]);
    }

    #[Route('/api/shipping', name: 'list_shipping')]
    public function getCountries(ShippingCostRepository $repository)
    {
        $shippings = $repository->findAll();
        $data = [];
        foreach ($shippings as $shipping)
        {
            if ($shipping->isAuthorization() === true)
            {
                if (in_array($shipping->getName(), array_column($data, 'name')))
                {
                    continue;
                }

                $data[] = [
                    'id' => $shipping->getId(),
                    'name' => $shipping->getName(),
                ];
            }
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/country', name: 'list_country')]
    public function listCountry(CountriesTaxesRepository $repository)
    {
        $countries = $repository->findAll();
        $data = [];
        foreach ($countries as $country)
        {
            $data[] = [
                'id' => $country->getId(),
                'name' => $country->getName(),
                'delivered_to' => $country->getDeliveredTo(),
                'taxes' => $country->getTaxes(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/api/admin/country/create', name: 'create_country_taxe')]
    public function countryCreate(Request $request, EntityManagerInterface $entity)
    {
        $data = json_decode($request->getContent(), true);
        $country_taxe = new CountriesTaxes();
        $country_taxe->setName($data['name']);
        $country_taxe->setDeliveredTo($data['delivered_to']);
        $country_taxe->setTaxes($data['taxes']);
        $entity->persist($country_taxe);
        $entity->flush();
        return new JsonResponse(['status' => 'Shipping cost created'], 201);
    }

    #[Route('/api/admin/country/modify', name: 'modify_country')]
    public function modifyCountry(Request $request, EntityManagerInterface $entity, CountriesTaxesRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $item)
        {
            $shipping = $repository->find($item['id']);
            if ($shipping)
            {
                $shipping->setName($item['name']);
                $shipping->setDeliveredTo($item['delivered_to']);
                $shipping->setTaxes($item['taxes']);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Country taxe modified', 200]);
    }

    #[Route('/api/admin/country/delete', name: 'delete_country')]
    public function deleteCountry(Request $request, EntityManagerInterface $entity, CountriesTaxesRepository $repository)
    {
        $data = json_decode($request->getContent(), true);
        foreach ($data as $country_taxe)
        {
            $country_id = $repository->find($country_taxe['id']);
            if ($country_id)
            {
                $entity->remove($country_id);
            }
        }

        $entity->flush();
        return new JsonResponse(['status' => 'Country taxe deleted', 200]);
    }

    #[Route('/api/admin/products/create/source', name: 'list_countries')]
    public function getCountriesOnce(CountriesTaxesRepository $repository)
    {
        $countries = $repository->findAll();
        $data = [];
        foreach ($countries as $country)
        {
            if (in_array($country->getName(), array_column($data, 'name')))
            {
                continue;
            }

            $data[] = [
                'id' => $country->getId(),
                'name' => $country->getName(),
            ];
        }
        return new JsonResponse($data);
    }
}
