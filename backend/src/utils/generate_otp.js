// Generate N digit OTPs
export default function generate_otp(digits = 6) {
	return Math.floor(Math.random() * (Math.pow(10, digits) - 1 - Math.pow(10, digits - 1))) + Math.pow(10, digits - 1);
}
