
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Create a simple HTML report
    const htmlReport = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>As-Built Report - Project ${id}</title>
        <style>
            body { font-family: sans-serif; padding: 40px; max-width: 800px; mx: auto; }
            h1 { color: #059669; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .meta { color: #666; }
            .pin-list { display: grid; gap: 20px; }
            .pin { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>As-Built Documentation Report</h1>
            <p class="meta">Project ID: ${id}</p>
            <p class="meta">Generated: ${new Date().toLocaleString()}</p>
        </div>
        <div>
            <h3>Executive Summary</h3>
            <p>This report contains the verified placement of photos and observations for the project.</p>
            
            <div class="pin-list">
                <div class="pin">
                    <h4>Observation #1</h4>
                    <p>Status: Verified</p>
                    <p>Location: Main Entrance</p>
                </div>
                <div class="pin">
                    <h4>Observation #2</h4>
                    <p>Status: Verified</p>
                    <p>Location: Kitchen Area</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(htmlReport, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}
