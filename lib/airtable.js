
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

// TODO: Implement with airtable

const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('apprer3ES2nIgRSZi');

export async function getSortedPostsData() {

    // fetch all posts data from a database

    const totalRecords = [];

    return new Promise((resolve, reject) => {
        base("entries")
          .select({
            fields: ["id", "title", "date", "content"],
            sort: [{ field: "date", direction: "desc" }],
          })
          .eachPage(
            function page(records, fetchNextPage) {

              records.forEach(async (record) => {
                const id = record.getId();
                const title = record.get("title");
                const date = record.get("date");
                const matterResult = matter(record.get("content")) // get metadata
    
                const processedContent = await remark().use(html).process(matterResult.content)
                const contentHtml = processedContent.toString();
                const plainTextContent = contentHtml.replace(/<[^>]*>/g, ''); // not the best solution -- misses entities among others
    
                if (!date || !title) return;
    
                totalRecords.push({
                  id,
                  title,
                  date,
                  plainTextContent,
                });
              });

              try {
                fetchNextPage();

              } catch(err) {
                console.log(err);
              }
    
            },
            function done(err) {
              if (err) return reject(err);
    
              return resolve(totalRecords);
            }
          );
      });
}

// used by GetStaticPaths (for dynamic routing)
export function getAllPostIds() {
    const recordIds = [];

    return new Promise((resolve, reject) => {
        base("entries")
          .select({
            sort: [{ field: "date", direction: "desc" }],
          })
          .eachPage(
            function page(records, fetchNextPage) {

              records.forEach((record) => {
                const id = record.getId();
    
                recordIds.push({
                    params: {
                        id
                    }
                });
              });

              try {
                fetchNextPage();

              } catch(err) {
                console.log(err);
              }
    
            },
            function done(err) {
              if (err) return reject(err);
    
              return resolve(recordIds);
            }
          );
      });
}


export async function getPostData(id) {

    return new Promise((resolve, reject) => {
        base('entries')
        .find(id, async (err, record) => {

            if(err) return reject(err);

            const date = record.get('date');
            const title = record.get('title');
            const matterResult = matter(record.get('content')) // get metadata

            const processedContent = await remark().use(html).process(matterResult.content)
            const contentHtml = processedContent.toString()
        
            return resolve({
                title,
                date,
                contentHtml,
            })
        })
    })


}