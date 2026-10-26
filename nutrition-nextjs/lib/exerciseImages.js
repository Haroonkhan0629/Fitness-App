const IMAGE_DIR = '/images/exercises';

const IMAGE_FILES_BY_GROUP = {
  Chest: [
    'pushup', 'decline-push-up', 'incline-push-up', 'handle-bar-dip', 'barbell-bench-press',
    'barbell-incline-bench-press-medium-grip', 'close-grip-barbell-bench-press',
    'dumbell-bench-press', 'incline-dumbbell-press', 'machine-chest-press', 'cable-chest-press',
    'dumbell-fly', 'incline-dumbbell-flyes', 'cable-fly', 'machine-fly',
  ],
  Back: [
    'pull-up-chin-up', 'chin-up', 'cable-pulldown', 'v-bar-pulldown', 'close-grip-front-lat-pulldown',
    'straight-arm-pulldown', 'cable-row', 'dumbell-row', 'barbell-row', 't-bar-row-with-handle',
    'inverted-row', 'machine-row', 'hyperextensions-back-extensions',
  ],
  Shoulders: [
    'barbell-overhead-press', 'standing-military-press', 'dumbbell-shoulder-press',
    'arnold-dumbbell-press', 'dumbell-lateral-raise', 'cable-lateral-raise',
    'machine-lateral-raise', 'front-dumbbell-raise', 'reverse-flyes', 'cable-rear-delt-fly',
    'rope-face-pull', 'upright-barbell-row',
  ],
  'Traps & Forearms': [
    'dumbell-shrug', 'barbell-shrug', 'barbell-wrist-curl', 'barbell-wrist-extension',
    'reverse-barbell-curl', 'wrist-roller',
  ],
  Biceps: [
    'barbell-arm-curl', 'ez-bar-curl', 'dumbell-arm-curl', 'alternate-hammer-curl',
    'incline-dumbbell-curl', 'concentration-curls', 'preacher-curl', 'cable-arm-curl',
    'standing-one-arm-cable-curl', 'machine-arm-curl',
  ],
  Triceps: [
    'barbell-arm-extension', 'ez-bar-skullcrusher', 'dumbell-arm-extension',
    'standing-dumbbell-triceps-extension', 'cable-arm-extension', 'triceps-pushdown',
    'triceps-pushdown-rope-attachment', 'machine-arm-extension', 'bench-dips', 'dips-triceps-version',
  ],
  Abs: [
    'crunches', 'reverse-crunch', 'cable-crunch', 'machine-crunch', 'leg-raise',
    'hanging-leg-raise', 'plank', 'ab-roller', 'russian-twist', 'air-bike',
  ],
  Legs: [
    'barbell-squat', 'front-barbell-squat', 'goblet-squat', 'barbell-sissy-squat',
    'machine-hack-squat', 'machine-leg-press', 'dumbell-split-squat', 'lunge', 'dumbbell-lunges',
    'barbell-walking-lunge', 'machine-leg-extension', 'machine-leg-curl', 'lying-leg-curls',
    'nordic-leg-curl', 'deadlift', 'romanian-deadlift', 'sumo-deadlift', 'dumbell-calf-raise',
    'standing-calf-raises', 'machine-calf-raise', 'vertical-calf-raise',
  ],
  Glutes: [
    'barbell-hip-thrust', 'barbell-glute-bridge', 'single-leg-glute-bridge', 'butt-lift-bridge',
    'glute-kickback',
  ],
};

// Labels that differ from the auto-generated name, including seed files renamed to match their images.
const LABEL_OVERRIDES = {
  'machine-fly': 'Pec Deck Fly',
  'machine-row': 'Leverage Iso Row',
  'machine-lateral-raise': 'Seated Dumbbell Lateral Raise',
  'nordic-leg-curl': 'Glute-Ham Raise',
  'vertical-calf-raise': 'Leg Press Calf Raise',
  'barbell-incline-bench-press-medium-grip': 'Barbell Incline Bench Press',
  'close-grip-barbell-bench-press': 'Close-Grip Barbell Bench Press',
  'close-grip-front-lat-pulldown': 'Close-Grip Front Lat Pulldown',
  'v-bar-pulldown': 'V-Bar Pulldown',
  't-bar-row-with-handle': 'T-Bar Row',
  'hyperextensions-back-extensions': 'Back Extension',
  'decline-push-up': 'Decline Push-Up',
  'incline-push-up': 'Incline Push-Up',
  'chin-up': 'Chin-Up',
  'ez-bar-curl': 'EZ-Bar Curl',
  'ez-bar-skullcrusher': 'EZ-Bar Skullcrusher',
  'standing-one-arm-cable-curl': 'Standing One-Arm Cable Curl',
  'triceps-pushdown-rope-attachment': 'Triceps Pushdown (Rope)',
  'dips-triceps-version': 'Triceps Dips',
  'butt-lift-bridge': 'Butt Lift Bridge',
};

const toLabel = (file) =>
  LABEL_OVERRIDES[file] ||
  file.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export const EXERCISE_IMAGE_GROUPS = Object.entries(IMAGE_FILES_BY_GROUP).map(([group, files]) => ({
  group,
  images: files
    .map((file) => ({ value: `${IMAGE_DIR}/${file}.jpg`, label: toLabel(file) }))
    .sort((a, b) => a.label.localeCompare(b.label)),
}));

export const EXERCISE_IMAGES = EXERCISE_IMAGE_GROUPS.flatMap(({ images }) => images);
