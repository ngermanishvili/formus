export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');

        if (!file) {
            return NextResponse.json(
                { status: "error", message: "ფაილი არ არის მითითებული" },
                { status: 400 }
            );
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'formus_test');
        formData.append('cloud_name', 'ds9dsumwl');

        // დავამატოთ timestamp და signature თუ გვინდა signed upload-ის გამოყენება
        // const timestamp = new Date().getTime();
        // const signature = generateSignature(timestamp); // თქვენი signature გენერაციის ფუნქცია

        const response = await fetch(
            'https://api.cloudinary.com/v1_1/ds9dsumwl/image/upload',
            {
                method: 'POST',
                body: formData
            }
        );

        const result = await response.json();

        if (response.ok) {
            return NextResponse.json({
                status: "success",
                url: result.secure_url
            });
        } else {
            throw new Error(result.message || 'ატვირთვა ვერ მოხერხდა');
        }

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { status: "error", message: error.message },
            { status: 500 }
        );
    }
}