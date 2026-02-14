export const schedule = [
    {
        day: "Monday",
        focus: "Chest & Triceps",
        exercises: [
            { name: "Bench Press", sets: 4, reps: "8-12", muscles: ["chest", "triceps", "shoulders"] },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", muscles: ["chest", "shoulders"] },
            { name: "Tricep Dips", sets: 3, reps: "12-15", muscles: ["triceps"] }
        ]
    },
    {
        day: "Tuesday",
        focus: "Back & Biceps",
        exercises: [
            { name: "Deadlift", sets: 4, reps: "5-8", muscles: ["back", "legs", "core"] },
            { name: "Pull Ups", sets: 3, reps: "Max", muscles: ["back", "biceps"] },
            { name: "Barbell Curl", sets: 3, reps: "10-12", muscles: ["biceps"] }
        ]
    },
    {
        day: "Wednesday",
        focus: "Rest / Active Recovery",
        exercises: []
    },
    {
        day: "Thursday",
        focus: "Legs & Shoulders",
        exercises: [
            { name: "Squats", sets: 4, reps: "8-12", muscles: ["legs", "core"] },
            { name: "Leg Press", sets: 3, reps: "10-15", muscles: ["legs"] },
            { name: "Overhead Press", sets: 4, reps: "8-12", muscles: ["shoulders", "triceps"] }
        ]
    },
    {
        day: "Friday",
        focus: "Full Body",
        exercises: [
            { name: "Clean and Jerk", sets: 5, reps: "3-5", muscles: ["full_body"] },
            { name: "Burpees", sets: 3, reps: "15", muscles: ["full_body"] }
        ]
    },
    {
        day: "Saturday",
        focus: "Cardio & Abs",
        exercises: [
            { name: "Running", sets: 1, reps: "30 mins", muscles: ["legs", "cardio"] },
            { name: "Plank", sets: 3, reps: "1 min", muscles: ["core"] }
        ]
    },
    {
        day: "Sunday",
        focus: "Rest",
        exercises: []
    }
];
