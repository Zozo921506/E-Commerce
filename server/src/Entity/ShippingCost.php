<?php

namespace App\Entity;

use App\Repository\ShippingCostRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ShippingCostRepository::class)]
class ShippingCost
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $delivery = null;

    #[ORM\Column]
    private ?float $taxes = null;

    #[ORM\Column]
    private ?bool $authorization = null;

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

    public function getDelivery(): ?string
    {
        return $this->delivery;
    }

    public function setDelivery(string $delivery): static
    {
        $this->delivery = $delivery;

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

    public function isAuthorization(): ?bool
    {
        return $this->authorization;
    }

    public function setAuthorization(bool $authorization): static
    {
        $this->authorization = $authorization;

        return $this;
    }
}
