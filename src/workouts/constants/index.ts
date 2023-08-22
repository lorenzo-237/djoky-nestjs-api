export const selectDefaultWorkout = {
  id: true,
  date: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
  user: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  },
  exercises: {
    select: {
      exercise: {
        select: {
          id: true,
          name: true,
          description: true,
          group: {
            select: {
              id: true,
              name: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      assignedAt: true,
      series: true,
      repetitions: true,
      time: true,
      weight: true,
      total: true,
    },
  },
};
