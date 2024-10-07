<?php

namespace App\Repository;

use App\Entity\Filter;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Filter>
 */
class FilterRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Filter::class);
    }

    public function findIdCategorie($name)
    {
        $connect = $this->getEntityManager()->getConnection();
        $query = "SELECT id FROM categorie WHERE name = ?";
        $prepare = $connect->prepare($query);
        $result = $prepare->executeQuery([$name]);
        return $result->fetchOne();
    }

    public function findIdArticles($name)
    {
        $connect = $this->getEntityManager()->getConnection();
        $query = "SELECT id FROM product WHERE name = ?";
        $prepare = $connect->prepare($query);
        $result = $prepare->executeQuery([$name]);
        return $result->fetchOne();
    }

    public function findDeleteArticles($id)
    {
        $connect = $this->getEntityManager()->getConnection();
        $query = "DELETE FROM filter WHERE id_article = ?";
        $prepare = $connect->prepare($query);
        $result = $prepare->executeQuery([$id]);
    }

    public function findDeleteCategories($id)
    {
        $connect = $this->getEntityManager()->getConnection();
        $query = "DELETE FROM filter WHERE id_categorie = ?";
        $prepare = $connect->prepare($query);
        $result = $prepare->executeQuery([$id]);
    }

    public function findCategorieName($id)
    {
        $connect = $this->getEntityManager()->getConnection();
        $query = "SELECT name FROM categorie WHERE id = ?";
        $prepare = $connect->prepare($query);
        $result = $prepare->executeQuery([$id]);
        return $result->fetchOne();
    }

    public function findArticleName($id)
    {
        $connect = $this->getEntityManager()->getConnection();
        $query = "SELECT name FROM product WHERE id = ?";
        $prepare = $connect->prepare($query);
        $result = $prepare->executeQuery([$id]);
        return $result->fetchOne();
    }
    //    /**
    //     * @return Filter[] Returns an array of Filter objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Filter
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
