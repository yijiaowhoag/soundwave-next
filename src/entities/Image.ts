import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Image {
  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field()
  url: string;
}
