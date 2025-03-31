import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function handler(req, res) {
    try {
        // Check if project with ID 11 exists
        const checkProject = await db.query(`
      SELECT * FROM projects WHERE id = 11
    `);

        if (checkProject.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Project with ID 11 not found',
                message_ge: 'პროექტი ID 11-ით ვერ მოიძებნა'
            });
        }

        // Update project with additional fields
        await db.query(`
      UPDATE projects 
      SET 
        second_section_img = '/assets/ortachala-project/four.png',
        second_section_title_en = 'Test Radisson Project Features',
        second_section_title_ge = 'სატესტო რედისონ პროექტის მახასიათებლები',
        second_section_description_en = 'This is a test project with all features of Ortachala Hills to demonstrate full functionality',
        second_section_description_ge = 'ეს არის სატესტო პროექტი ორთაჭალა ჰილსის ყველა ფუნქციონალით სრული შესაძლებლობების საჩვენებლად',
        description_en = 'The Radisson test project is a luxurious residential complex offering premium apartments with modern amenities and stunning views.',
        description_ge = 'რედისონის სატესტო პროექტი არის ლუქსი საცხოვრებელი კომპლექსი, რომელიც გთავაზობთ პრემიუმ აპარტამენტებს თანამედროვე აღჭურვილობით და შესანიშნავი ხედით.',
        features_en = $1,
        features_ge = $2
      WHERE id = 11
    `, [
            '[{"title":"Green Environment","description":"Surrounded by nature","icon":"🌳"},{"title":"Secure Area","description":"24/7 security and surveillance","icon":"🔒"},{"title":"Modern Design","description":"Contemporary architecture","icon":"🏢"}]',
            '[{"title":"მწვანე გარემო","description":"ბუნებით გარშემორტყმული","icon":"🌳"},{"title":"დაცული ტერიტორია","description":"24/7 დაცვა და თვალთვალი","icon":"🔒"},{"title":"თანამედროვე დიზაინი","description":"თანამედროვე არქიტექტურა","icon":"🏢"}]'
        ]);

        // Check if there are project sections for the project
        const checkSections = await db.query(`
      SELECT * FROM project_sections WHERE project_id = 11
    `);

        if (checkSections.length === 0) {
            // Add project sections
            await db.query(`
        INSERT INTO project_sections 
        (project_id, title_en, title_ge, description_en, description_ge, image_url, section_type) 
        VALUES 
        (11, 'Modern Apartments', 'თანამედროვე აპარტამენტები', 'Our modern apartments offer the perfect blend of comfort and style.', 'ჩვენი თანამედროვე აპარტამენტები გთავაზობთ კომფორტისა და სტილის იდეალურ შერწყმას.', '/assets/ortachala-project/three.png', 'features'),
        (11, 'Stunning Views', 'შესანიშნავი ხედები', 'Enjoy breathtaking views from your private balcony.', 'დატკბით შთამბეჭდავი ხედებით თქვენი პირადი აივნიდან.', '/assets/ortachala-project/two.png', 'features'),
        (11, 'About Project', 'პროექტის შესახებ', 'A luxury apartment complex designed with modern living in mind.', 'ლუქსი აპარტამენტების კომპლექსი, შექმნილი თანამედროვე ცხოვრებისთვის.', '/assets/ortachala-project/one.png', 'about')
      `);
        }

        return res.status(200).json({
            status: 'success',
            message: 'Project data added successfully',
            message_ge: 'პროექტის მონაცემები წარმატებით დაემატა'
        });

    } catch (error) {
        console.error('Migration error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update project data',
            message_ge: 'პროექტის მონაცემების განახლება ვერ მოხერხდა',
            error: error.message
        });
    }
} 