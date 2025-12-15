export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-lg text-gray-700 mb-8">
                There was a problem signing you in. The authentication code could not be exchanged for a session.
            </p>
            <p className="text-sm text-gray-500 mb-8 max-w-md">
                Common causes: Link expired, used, or configuration mismatch.
            </p>
            <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Return to Login
            </a>
        </div>
    );
}
