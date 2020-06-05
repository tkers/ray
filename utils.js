const PI2 = Math.PI * 2;
const deg2rad = deg => (deg / 180) * Math.PI;
const rad2deg = rad => (rad * 180) / Math.PI;
const normalise = rad => (rad + PI2) % PI2;
