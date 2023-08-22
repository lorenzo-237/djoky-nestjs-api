export interface SelectWorkout {
  id: number;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: boolean;
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  exercises: {
    exercise: {
      id: number;
      name: string;
      description: string;
      group: {
        id: number;
        name: string;
        category: {
          id: number;
          name: string;
        };
      };
    };
  }[];
}
