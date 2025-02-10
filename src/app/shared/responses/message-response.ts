import { ApiProperty } from "@nestjs/swagger";

export class MessageResponse {
  @ApiProperty({
    description: "Message of response",
    type: String,
    example:
      "Resource with id <842ae545-5194-44b0-8742-060fae82270b> updated successfully",
  })
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
