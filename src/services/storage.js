const STORAGE_KEYS = {
    USER: 'workout_planner_user',
    HISTORY: 'workout_planner_history',
    DIET: 'workout_planner_diet',
};

// Default User Data
const defaultUser = {
    name: 'Athlete',
    age: 25,
    height: 175, // cm
    weight: 70, // kg
    avatarUrl: '',
    isPro: false, // Pro Membership Status
    injuries: [],
    contacts: {
        sos: '911',
        trainer: 'Unassigned'
    },
    // Macro Targets (Daily)
    targets: {
        calories: 2500,
        protein: 150, // g
        carbs: 300,   // g
        fats: 70      // g
    },
    // Custom Supplement Stack
    stack: [] // Array of { id, name, dosage, time }
};

export const storage = {
    // User Profile
    getUser: () => {
        const data = localStorage.getItem(STORAGE_KEYS.USER);
        if (data) {
            const user = JSON.parse(data);
            return { ...defaultUser, ...user, targets: { ...defaultUser.targets, ...user.targets } };
        }
        return defaultUser;
    },
    saveUser: (user) => {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    // Workout History
    getHistory: () => {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return data ? JSON.parse(data) : {};
    },

    // Save a workout completion status
    // date: YYYY-MM-DD
    logWorkout: (date, workoutData) => {
        const history = storage.getHistory();
        // workoutData can now include { completed: true, caloriesBurned: 300 }
        history[date] = workoutData;
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    },

    // Diet & Supplements
    getDiet: () => {
        const data = localStorage.getItem(STORAGE_KEYS.DIET);
        return data ? JSON.parse(data) : {};
    },
    // dietData: { calories, protein, carbs, fats }
    logDiet: (date, dietData) => {
        const diet = storage.getDiet();
        const currentDay = diet[date] || { calories: 0, protein: 0, carbs: 0, fats: 0 };

        diet[date] = {
            calories: (currentDay.calories || 0) + (dietData.calories || 0),
            protein: (currentDay.protein || 0) + (dietData.protein || 0),
            carbs: (currentDay.carbs || 0) + (dietData.carbs || 0),
            fats: (currentDay.fats || 0) + (dietData.fats || 0)
        };

        localStorage.setItem(STORAGE_KEYS.DIET, JSON.stringify(diet));
    }
};
