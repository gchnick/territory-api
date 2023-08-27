enum CardinalPoint {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST'
}

type Limits = Partial<Record<CardinalPoint, string>>;

type Territory = {
  id?: string;
  number: number;
  label: string;
  limits: Limits;
  lastDateCompleted: Date;
};

type PartialTerritory = Partial<Territory>;

type TerritoryEntity = {
  id: string;
  number: number;
  label: string;
  north_limit: string;
  south_limit: string;
  east_limit: string;
  west_limit: string;
  last_date_completed: Date;
  url_map_image: string | null;
  assigned_lock: boolean;
};

export { CardinalPoint, PartialTerritory, Territory, TerritoryEntity };
