import { Categoria } from "../entities/category";

const DELAY_MS = 600;

export class CategoryDataSource {
  private static instance: CategoryDataSource;

  private categorias: Categoria[] = [
    {
      id: "comidas",
      nome: "Comidas",
      corBorda: "#501673",
      corSeta: "#501673",
      imagem: require("@/assets/images/menu/categoria-comidas.png"),
    },
    {
      id: "bebidas",
      nome: "Bebidas",
      corBorda: "#1b873f",
      corSeta: "#1b873f",
      imagem: require("@/assets/images/menu/categoria-bebidas.png"),
    },
  ];

  private constructor() {}

  /**
   * Objetivo: Obter a instância única (Singleton) do banco de categorias
   * @returns A instância única de CategoryDataSource
   */
  public static getInstance(): CategoryDataSource {
    if (!CategoryDataSource.instance) {
      CategoryDataSource.instance = new CategoryDataSource();
    }
    return CategoryDataSource.instance;
  }

  /**
   * Objetivo: Listar todas as categorias cadastradas
   * @returns Uma lista contendo todas as categorias
   */
  public async listarCategorias(): Promise<Categoria[]> {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    return [...this.categorias];
  }

  /**
   * Objetivo: Encontrar uma categoria através do seu id
   * @param categoriaId Representa o ID da categoria
   * @returns Uma categoria no caso feliz, caso contrário undefined
   */
  public async buscarCategoriaPorId(categoriaId: string): Promise<Categoria | undefined> {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    return this.categorias.find((c) => c.id === categoriaId);
  }
}

export const categoryDataSource = CategoryDataSource.getInstance();
