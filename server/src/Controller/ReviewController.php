<?php

namespace App\Controller;

use App\Entity\Review;
use App\Repository\ReviewRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ReviewController extends AbstractController
{
    #[Route('/api/reviews/add', methods: ['POST'])]
    public function addReview(Request $request, EntityManagerInterface $em, ProductRepository $productRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['productId']) || !isset($data['content'])) {
            return new JsonResponse(['message' => 'Invalid data'], 400);
        }

        $product = $productRepo->find($data['productId']);

        if (!$product) {
            return new JsonResponse(['message' => 'Product not found'], 404);
        }

        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'User not authenticated'], 401);
        }

        $review = new Review();
        $review->setContent($data['content']);
        $review->setFirstname($user->getFirstname());
        $review->setLastname($user->getLastname());
        $review->setProduct($product);

        $em->persist($review);
        $em->flush();

        return new JsonResponse(['message' => 'Review added successfully'], 201);
    }

    #[Route('/api/reviews/{productId}', methods: ['GET'])]
    public function getReviews(int $productId, ReviewRepository $reviewRepo): JsonResponse
    {
        $reviews = $reviewRepo->findBy(['product' => $productId]);
        
        $data = array_map(fn($review) => [
            'id' => $review->getId(),
            'content' => $review->getContent(),
            'firstname' => $review->getFirstname(),
            'lastname' => $review->getLastname(),
            'createdAt' => $review->getCreatedAt()->format('Y-m-d H:i:s'),
        ], $reviews);

        return new JsonResponse($data);
    }
}
