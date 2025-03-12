import type { TerritoryPrimitives } from "@/contexts/Overseer/territories/domain/territory";

import { ApiProperty } from "@nestjs/swagger";

import { Territory } from "@/contexts/Overseer/territories/domain/territory";

export class TerritoriesResponse {
  @ApiProperty({
    description: "List of territories",
    type: "array",
    items: {
      type: "object",
      properties: {
        congregationId: { type: "string", example: "7047" },
        id: { type: "string", example: "130928d6-c4a1-42c3-8d54-31f70734b6d3" },
        currentAssigned: { type: "boolean", example: true },
        label: { type: "string", example: "New York" },
        lastDateCompleted: {
          type: "date",
          example: "2023-03-01",
        },
        locality: { type: "string", example: "Street 3, Street 4" },
        localityInPart: {
          type: "string",
          example: "Ocean Park, Street 21, Street 22",
        },
        map: { type: "string" },
        meetingPlaces: { type: "array", items: { type: "object" } },
        number: { type: "number", example: 45 },
        quantityHouses: { type: "number", example: 58 },
        sector: { type: "string", example: "Bull Ranch" },
      },
      required: [
        "congregationId",
        "id",
        "currentAssigned",
        "label",
        "lastDateCompleted",
        "locality",
        "number",
        "quantityHouses",
        "meetingPlaces",
      ],
    },
  })
  public readonly data: TerritoryPrimitives[];

  constructor(territories: Territory[] | Territory) {
    this.data = Array.isArray(territories)
      ? territories.map(territory => territory.toPrimitives())
      : [territories.toPrimitives()];
  }
}
