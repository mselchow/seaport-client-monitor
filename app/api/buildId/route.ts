export async function GET() {
    return new Response(JSON.stringify({ buildId: process.env.BUILD_ID }), {
        status: 200,
    });
}
