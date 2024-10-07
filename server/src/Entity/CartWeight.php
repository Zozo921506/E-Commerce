<?php

namespace App\Entity;

use App\Repository\CartWeightRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CartWeightRepository::class)]
class CartWeight
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $min_weight = null;

    #[ORM\Column]
    private ?float $max_weight = null;

    #[ORM\Column]
    private ?float $price = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMinWeight(): ?float
    {
        return $this->min_weight;
    }

    public function setMinWeight(float $min_weight): static
    {
        $this->min_weight = $min_weight;

        return $this;
    }

    public function getMaxWeight(): ?float
    {
        return $this->max_weight;
    }

    public function setMaxWeight(float $max_weight): static
    {
        $this->max_weight = $max_weight;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }
}
