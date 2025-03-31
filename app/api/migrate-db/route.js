import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { operation } = await request.json();
        console.log("Migration operation requested:", operation);

        if (operation === "add_display_order") {
            // Check if display_order column already exists
            const result = await db.query(`
                SELECT * FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'display_order'
            `);

            if (result.length === 0) {
                // The column doesn't exist, so add it
                await db.query(`
                    ALTER TABLE projects 
                    ADD COLUMN display_order INTEGER
                `);
                return NextResponse.json({
                    status: "success",
                    message: "display_order ველი წარმატებით დაემატა"
                });
            } else {
                return NextResponse.json({
                    status: "success",
                    message: "display_order ველი უკვე არსებობს"
                });
            }
        } else if (operation === "create_project_info_table") {
            // Check if project_info table already exists
            const tableExists = await db.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'project_info'
                );
            `);

            if (!tableExists[0].exists) {
                // Create the project_info table
                await db.query(`
                    CREATE TABLE project_info (
                        id SERIAL PRIMARY KEY,
                        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                        title_en VARCHAR(255),
                        title_ge VARCHAR(255),
                        description_en TEXT,
                        description_ge TEXT,
                        image_url TEXT,
                        display_order INTEGER,
                        section_type VARCHAR(50) DEFAULT 'feature',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    )
                `);

                return NextResponse.json({
                    status: "success",
                    message: "project_info ცხრილი წარმატებით შეიქმნა"
                });
            } else {
                return NextResponse.json({
                    status: "success",
                    message: "project_info ცხრილი უკვე არსებობს"
                });
            }
        } else if (operation === "add_section_type_to_project_info") {
            // Check if section_type column already exists
            const result = await db.query(`
                SELECT * FROM information_schema.columns 
                WHERE table_name = 'project_info' AND column_name = 'section_type'
            `);

            if (result.length === 0) {
                // The column doesn't exist, so add it
                await db.query(`
                    ALTER TABLE project_info 
                    ADD COLUMN section_type VARCHAR(50) DEFAULT 'feature'
                `);
                return NextResponse.json({
                    status: "success",
                    message: "section_type ველი წარმატებით დაემატა project_info ცხრილში"
                });
            } else {
                return NextResponse.json({
                    status: "success",
                    message: "section_type ველი უკვე არსებობს project_info ცხრილში"
                });
            }
        } else if (operation === "seed_ortachala_project_info") {
            // Add Ortachala project info data
            const projectId = 1; // Ortachala project ID

            // First check if data already exists
            const existingData = await db.query(`
                SELECT * FROM project_info WHERE project_id = $1 AND section_type = 'feature'
            `, [projectId]);

            if (existingData.length > 0) {
                return NextResponse.json({
                    status: "success",
                    message: "ორთაჭალის პროექტის ინფორმაცია უკვე არსებობს"
                });
            }

            // These are the sections from the interactive-section.jsx
            const sections = [
                {
                    title_en: "Energy Efficiency",
                    title_ge: "ენერგოეფექტურობა",
                    description_en: 'The construction of "Ortachala Hills" is being carried out using environmentally friendly and energy-efficient materials that feature high thermal and sound insulation properties. Energy efficiency significantly reduces heating, cooling and electricity costs.',
                    description_ge: "ორთაჭალა ჰილსის მშენებლობა მიმდინარეობს ეკოლოგიური და ენერგოეფექტური სამშენებლო მასალებით, რომლებიც მაღალი თბოიზოლაციური და ხმის იზოლაციური თვისებებით გამოირჩევიან. ენერგოეფექტურობა მნიშვნელოვნად ამცირებს გათბობის, გაგრილებისა და ელექტროენერგიის ხარჯებს.",
                    image_url: "/assets/ortachala-project/1-energo.png",
                    display_order: 1,
                    section_type: "feature"
                },
                {
                    title_en: "Essential facilities in one place",
                    title_ge: "ყოველდღიური ცხოვრებისთვის აუცილებელი ობიექტები ერთ სივრცეში",
                    description_en: "The residential complex will include a supermarket, pharmacy, gastro space, beauty salon and other commercial facilities to meet daily living needs.",
                    description_ge: "საცხოვრებელი კომპლექსის ტერიტორიაზე გათვალისწინებულია სუპერმარკეტი, აფთიაქი, გასტრო სივრცე, სილამაზის ცენტრი და სხვა კომერციული ობიექტები.",
                    image_url: "/assets/ortachala-project/3-everyday-life.png",
                    display_order: 2,
                    section_type: "feature"
                },
                {
                    title_en: "3,000 m² internal recreational area",
                    title_ge: "3 000 მ2 შიდა რეკრეაციული ზონა",
                    description_en: "The internal recreational area features walking paths, relaxation spaces, a children's playground and cycling lanes.",
                    description_ge: "შიდა რეკრეაციული ზონა მოიცავს სასეირნო ბილიკებს, მოსასვენებელ სივრცეებს, საბავშვო სათამაშო მოედანს და ველო ბილიკებს.",
                    image_url: "/assets/ortachala-project/4-recreation.png",
                    display_order: 3,
                    section_type: "feature"
                },
                {
                    title_en: "24/7 full security",
                    title_ge: "სრული ტერიტორიის დაცვა 24/7",
                    description_en: "The residential complex is a gated community, fully equipped with security cameras and offering round-the-clock security.",
                    description_ge: "საცხოვრებელი კომპლექსი დახურული ტიპისაა და სრულად აღჭურვილია დაცვის კამერებით.",
                    image_url: "/assets/ortachala-project/2-teritory-security.png",
                    display_order: 4,
                    section_type: "feature"
                }
            ];

            // Insert each section into the database
            for (const section of sections) {
                await db.query(`
                    INSERT INTO project_info (
                        project_id, 
                        title_en, 
                        title_ge, 
                        description_en, 
                        description_ge, 
                        image_url, 
                        display_order,
                        section_type
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [
                    projectId,
                    section.title_en,
                    section.title_ge,
                    section.description_en,
                    section.description_ge,
                    section.image_url,
                    section.display_order,
                    section.section_type
                ]);
            }

            return NextResponse.json({
                status: "success",
                message: "ორთაჭალის პროექტის ინფორმაცია წარმატებით დაემატა"
            });
        } else if (operation === "seed_about_ortachala") {
            // Add About Ortachala page data
            const projectId = 1; // Ortachala project ID

            // First check if data already exists
            const existingData = await db.query(`
                SELECT * FROM project_info WHERE project_id = $1 AND section_type = 'about_page'
            `, [projectId]);

            if (existingData.length > 0) {
                return NextResponse.json({
                    status: "success",
                    message: "ორთაჭალის შესახებ გვერდის ინფორმაცია უკვე არსებობს"
                });
            }

            // These are the sections from the about-ortachala page
            const aboutSections = [
                {
                    title_en: "Ortachala Hills",
                    title_ge: "ორთაჭალა ჰილსი",
                    description_en: '"Ortachala Hills" is located in one of the most peaceful and green areas, close to the cultural center of the old city. The complex is distinguished by its high construction standards and innovative concept, designed to meet every need and desire of its residents.',
                    description_ge: '"ორთაჭალა ჰილსი" ყველაზე მშვიდ და გამწვანებულ ლოკაციაზე, ძველი ქალაქის კულტურულ ცენტრთან ახლოს მდებარეობს. კომპლექსი მაღალი სამშენებლო სტანდარტებითა და კონცეფციით გამოირჩევა, სადაც მომხმარებლის ყველა სურვილი და საჭიროებაა გათვალისწინებული.',
                    image_url: "/assets/ortachala-project/hero.jpg",
                    display_order: 1,
                    section_type: "about_page"
                },
                {
                    title_en: "Construction",
                    title_ge: "მშენებლობა",
                    description_en: "The construction spans 10,000 square meters and includes four residential blocks (15-story and 8-story buildings) and a commercial facility. Due to the project's scale, construction is being carried out in several phases. The construction of the 15-story residential block is nearly complete and commercial spaces are being opened. The 8-story residential block is scheduled for completion in the fall of 2025.",
                    description_ge: "მშენებლობა მიმდინარეობს 10 000 კვადრატულ მეტრზე, რომელიც მოიცავს 4 საცხოვრებელ ბლოკს (15 და 8 სართულიან შენობებს) და კომერციულ შენობა-ნაგებობას. მასშტაბიდან გამომდინარე მშენებლობა ხორციელდება რამოდენიმე ეტაპად. 15 სართულიანი საცხოვრებელი ბლოკის მშენებლობა თითქმის დასრულებულია და კომერციული ობიექტები იხსნება. 8 სართულიანი საცხოვრებელი ბლოკის მშენებლობა დასრულდება 2025 წლის შემოდგომაზე.",
                    image_url: "/assets/ortachala-project/ortachala-2.png",
                    display_order: 2,
                    section_type: "about_page"
                },
                {
                    title_en: "Recreational Space",
                    title_ge: "რეკრეაციული სივრცე",
                    description_en: "The project is particularly appealing due to its recreational space, which covers 3,000 square meters and includes various entertainment and relaxation areas. The residential complex is fully adapted for individuals with disabilities.\n\nThe investment in this project is entirely dedicated to creating an environmentally friendly, safe and tranquil development where vehicles are restricted from entering.",
                    description_ge: "პროექტი განსაკუთრებით მომხიბვლელია რეკრეაციული სივრცით, რომელიც 3 000 კვადრატული მეტრის ფართობზეა გაშლილი და სხვადასხვა გასართობ, თუ მოსასვენებელ კუთხეს მოიცავს. საცხოვრებელი კომპლექსი მთლიანად ადაპტირებულია შ.შ.მ. პირებზე.\n\nპროექტში განხორციელებული ინვესტიცია, სრულად მიმართულია ეკოლოგიურად სუფთა, უსაფრთხო და მყუდრო განაშენიანების შექმნაზე, სადაც ავტომობილები ვერ ხვდებიან.",
                    image_url: "/assets/ortachala-project/ortachala-3.png",
                    display_order: 3,
                    section_type: "about_page"
                }
            ];

            // Insert each section into the database
            for (const section of aboutSections) {
                await db.query(`
                    INSERT INTO project_info (
                        project_id, 
                        title_en, 
                        title_ge, 
                        description_en, 
                        description_ge, 
                        image_url, 
                        display_order,
                        section_type
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [
                    projectId,
                    section.title_en,
                    section.title_ge,
                    section.description_en,
                    section.description_ge,
                    section.image_url,
                    section.display_order,
                    section.section_type
                ]);
            }

            return NextResponse.json({
                status: "success",
                message: "ორთაჭალის შესახებ გვერდის ინფორმაცია წარმატებით დაემატა"
            });
        } else if (operation === "add_subtitle_columns") {
            // Check if subtitle columns already exist
            const subtitleGeExists = await db.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'project_info' AND column_name = 'subtitle_ge'
                );
            `);

            const subtitleEnExists = await db.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'project_info' AND column_name = 'subtitle_en'
                );
            `);

            let message = "";

            // Add subtitle_ge column if it doesn't exist
            if (!subtitleGeExists[0].exists) {
                await db.query(`
                    ALTER TABLE project_info 
                    ADD COLUMN subtitle_ge TEXT
                `);
                message += "subtitle_ge ველი წარმატებით დაემატა. ";
            } else {
                message += "subtitle_ge ველი უკვე არსებობს. ";
            }

            // Add subtitle_en column if it doesn't exist
            if (!subtitleEnExists[0].exists) {
                await db.query(`
                    ALTER TABLE project_info 
                    ADD COLUMN subtitle_en TEXT
                `);
                message += "subtitle_en ველი წარმატებით დაემატა.";
            } else {
                message += "subtitle_en ველი უკვე არსებობს.";
            }

            // Update Ortachala Hills first section with subtitle data
            await db.query(`
                UPDATE project_info 
                SET subtitle_ge = 'დაფინანსებულია "თიბისი" ბანკის მიერ',
                    subtitle_en = 'Financed by TBC Bank'
                WHERE project_id = 1 AND section_type = 'about_page' AND display_order = 1
            `);

            message += " ორთაჭალა ჰილსისთვის subtitle მნიშვნელობები განახლდა.";

            return NextResponse.json({
                status: "success",
                message: message
            });
        } else {
            return NextResponse.json({
                status: "error",
                message: "უცნობი ოპერაცია"
            }, { status: 400 });
        }
    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
} 