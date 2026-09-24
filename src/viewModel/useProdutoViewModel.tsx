import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import type { Product } from "@/model/entities/product";
import { ProductDatabase } from "@/model/data/productDatabase";

export type ProdutoState = {
  produto: Product | null;
  quantidade: number;
  carregando: boolean;
  erro: string | null;
};

export type ProdutoActions = {
  incrementarQuantidade: () => void;
  decrementarQuantidade: () => void;
  voltar: () => void;
};

export function useProdutoViewModel(): [ProdutoState, ProdutoActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const produtoId = Array.isArray(id) ? id[0] : id;

  const [produto, setProduto] = useState<Product | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const db = ProductDatabase.getInstance();

  useEffect(() => {
    async function carregarDetalhes(): Promise<void> {
      if (!produtoId) {
        setCarregando(false);
        setErro("Produto não identificado.");
        return;
      }

      try {
        setCarregando(true);
        setErro(null);
        const resultado = await db.buscarProdutoPorId(produtoId);
        if (resultado) {
          setProduto(resultado);
        } else {
          setErro("Item não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
        setErro("Erro ao carregar detalhes do produto.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDetalhes();
  }, [produtoId]);

  const incrementarQuantidade = () => {
    setQuantidade((prev) => prev + 1);
  };

  const decrementarQuantidade = () => {
    setQuantidade((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const voltar = () => {
    router.back();
  };

  return [
    {
      produto,
      quantidade,
      carregando,
      erro,
    },
    {
      incrementarQuantidade,
      decrementarQuantidade,
      voltar,
    },
  ];
}
