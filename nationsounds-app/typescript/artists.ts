export type Scene = {
  id: number;
  name: string;
};

export type Artists = {
  name: string;
  id: number;
  tags?: { tag: { name: string } }[];
  jour?: string;
  heure?: string;
  scene?: Scene;
  description: string;
  sceneId: number;
  imageUrl: string;
};
