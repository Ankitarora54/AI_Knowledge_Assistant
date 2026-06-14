async function indexPages(){

    const pages =
        await confluenceService
            .getPages();

    for(const page of pages){

        const document =
            await documentRepo
                .createDocument(

                    page.title,

                    page.body,

                    "confluence",

                    {
                        page_id:
                            page.id
                    }
                );

        const embedding =
            await embeddingService
                .generateEmbedding(
                    page.body
                );

        await embeddingRepo
            .saveEmbedding(

                page.body,

                embedding,

                "confluence",

                {
                    page_id:
                        page.id
                },

                document.id
            );
    }
}