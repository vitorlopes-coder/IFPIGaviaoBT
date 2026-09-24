import { useEffect, useState } from "react";
import { router } from "expo-router"
import type { Categoria } from '@/model/entities/category'
import { CategoryDatabase } from '@/model/data/categoryDatabase'

export type InicioState = {
    categorias: Array<Categoria>;
    carregando: boolean;
    erro: string | null;
}

export type InicioActions = {
    abrirCategoria: (categoriaId: string) => void
}


export function useInicioViewModel(): [InicioState, InicioActions] {
    const [categorias, setCategorias] = useState<Array<Categoria>>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    const bd = CategoryDatabase.getInstance();

    useEffect(() => {
        async function carregarCategorias(): Promise<void> {
            try {
                setCarregando(true);
                setErro(null);
                const resultado = await bd.listarCategorias();
                setCategorias(resultado);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
                setErro("Erro ao carregar categorias");
            } finally {
                setCarregando(false);
            }
        }

        carregarCategorias();
    }, []);

    const abrirCategoria = (categoriaId: string) => {
        router.push(`/category/${categoriaId}` as any);
    };

    return [
        { categorias, carregando, erro },
        { abrirCategoria }
    ];
}