<?php

namespace App\Repository;

use App\Entity\Review;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Review::class);
    }

    public function findByProduct($productId)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.product = :productId')
            ->setParameter('productId', $productId)
            ->getQuery()
            ->getResult();
    }
}
