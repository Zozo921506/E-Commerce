<?php

namespace App\Repository;

use App\Entity\ShippingCost;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ShippingCost>
 */
class ShippingCostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShippingCost::class);
    }

    public function findPrice($name, $delivery)
    {
        $connect = $this->getEntityManager()->getConnection();
        $query = "SELECT taxes FROM shipping_cost WHERE name = ? AND delivery = ?";
        $prepare = $connect->prepare($query);
        $result = $prepare->executeQuery([$name, $delivery]);
        return $result->fetchOne();
    }

    //    /**
    //     * @return ShippingCost[] Returns an array of ShippingCost objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ShippingCost
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
