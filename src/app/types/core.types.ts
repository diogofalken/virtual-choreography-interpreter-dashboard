export type ActorType = { id: string; name: string };

export type VerbType = {
  id: string;
  display: string;
};

export type ObjectType = {
  id: string;
  definition: { name: string };
};

export type PlaceType = {
  id: string;
  name: string;
};

export type ContextType = {
  id: string;
  extensions: {
    timestamp: string;
    description: string;
    event: string;
    component: string;
  };
};

export type Source = {
  id: string;
  name: string;
  type: string;
};

export type Recipe = {
  name: string;
  actors: ActorType[];
  verbs: VerbType[];
  objects: ObjectType[];
  places: PlaceType[];
  contexts: ContextType[];
};

export type Statement = {
  id: string;
  actor: ActorType;
  verb: VerbType;
  object: ObjectType;
  place: PlaceType;
  context: ContextType;
};
