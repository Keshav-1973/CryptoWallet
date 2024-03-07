export type ValueOf<t> = t[keyof t];

export type RouteMetadata<t extends string> = Record<
  t,
  {
    readonly name: string;
  }
>;
