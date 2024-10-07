<?php

namespace App\Repository;

use App\Entity\CountriesTaxes;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CountriesTaxes>
 */
class CountriesTaxesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CountriesTaxes::class);
    }

    public function findSourcePrice($name, $delivered_to)
    {
        $connect = $this->getEntityManager()->getConnection();
        $query = "SELECT taxes FROM countries_taxes WHERE name = ? AND delivered_to = ?";
        $prepare = $connect->prepare($query);
        $result = $prepare->executeQuery([$name, $delivered_to]);
        return $result->fetchOne();
    }

    //    /**
    //     * @return CountriesTaxes[] Returns an array of CountriesTaxes objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?CountriesTaxes
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
