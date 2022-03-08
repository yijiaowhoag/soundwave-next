import { Field, ID, ObjectType } from 'type-graphql';
import { TrackInQueue } from './Queue';

@ObjectType()
export class Session {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => [TrackInQueue])
  queue: TrackInQueue[];
}
