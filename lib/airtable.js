

// TODO: Implement with airtable

const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('apprer3ES2nIgRSZi');

export async function getSortedPostsData() {


    // fetch post data from a database
    
    let totalRecords = [];

    base('entries')
    .select({ 
        maxRecords: 3,
        view: "Grid view",
    })
    .eachPage((records) => {

        records.forEach((record) => {

            let id = record.getId();
            let title = record.get('title');
            let date = record.get('date');

            totalRecords.push({
                id: id,
                title: title,
                date: date,
            });

        })
        
        return totalRecords;
        
    }, (err) => {
        console.log(err);
    })
    
    return [];
}

/*

export function getSortedPostsData() {

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
    
      const id = fileName.replace(/\.md$/, '')
  
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
  
      const matterResult = matter(fileContents)
  
      return {
        id,
        ...matterResult.data
      }
    })
    
    return allPostsData.sort(({ date: a }, { date: b }) => {
      if (a < b) {
        return 1
      } else if (a > b) {
        return -1
      } else {
        return 0
      }
    })
  }

  */