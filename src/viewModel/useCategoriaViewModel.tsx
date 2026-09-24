import { ProductDataSource } from "@/model/dataSource/productDataSource";
import type { Product } from "@/model/entities/product";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export type CategoriaState = {
  categoriaId: string;
  nomeCategoria: string;
  produtos: Product[];
  carregando: boolean;
  erro: string | null;
};

export type CategoriaActions = {
  abrirProduto: (produtoId: string) => void;
  voltar: () => void;
};

export function useCategoriaViewModel(): [CategoriaState, CategoriaActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoriaId = Array.isArray(id) ? id[0] : id || "";

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const nomeCategoria =
    categoriaId === "bebidas"
      ? "Bebidas"
      : categoriaId === "comidas"
        ? "Comidas"
        : "Cardápio";

  const db = ProductDataSource.getInstance();

  useEffect(() => {
    async function carregarProdutos(): Promise<void> {
      if (!categoriaId) {
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro(null);
        const resultado = await db.listarProdutosPorCategoria(categoriaId);
        setProdutos(resultado);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setErro("Não foi possível carregar os produtos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, [categoriaId]);

  const abrirProduto = (produtoId: string) => {
    router.push(`/item/${produtoId}` as any);
  };

  const voltar = () => {
    router.back();
  };

  return [
    {
      categoriaId,
      nomeCategoria,
      produtos,
      carregando,
      erro,
    },
    {
      abrirProduto,
      voltar,
    },
  ];
}
