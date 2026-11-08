// profile-service/src/services/auth.service.ts
import {Config} from "../../config";

export const authService = {
    async verifyToken(token: string) {
        try {
            const response = await fetch(`${Config.authService.url}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token})
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.valid ? data : null;
        } catch (error) {
            console.error('Error verifying token:', error);
            return null;
        }
    }
}