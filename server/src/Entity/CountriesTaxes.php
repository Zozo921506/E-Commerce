<?php

namespace App\Entity;

use App\Repository\CountriesTaxesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CountriesTaxesRepository::class)]
class CountriesTaxes
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $delivered_to = null;

    #[ORM\Column]
    private ?float $taxes = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDeliveredTo(): ?string
    {
        return $this->delivered_to;
    }

    public function setDeliveredTo(string $delivered_to): static
    {
        $this->delivered_to = $delivered_to;

        return $this;
    }

    public function getTaxes(): ?float
    {
        return $this->taxes;
    }

    public function setTaxes(float $taxes): static
    {
        $this->taxes = $taxes;

        return $this;
    }
}
