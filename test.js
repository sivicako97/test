const Database = require('better-sqlite3');
const db = new Database('ellipsys_test_db.db3', { verbose: console.log });

//récupèration des noms des colonnes 
const stmt = db.prepare('select * from oa_trf_src ;');
const columnNames = stmt.columns().map(column => column.name);
//console.log(columnNames);


//créer les noms des tables de lookup 
const lk_Tables = []
for ( let i = 0; i < columnNames.length; i++){
        lk_Tables.push(`oa_trf_src_${columnNames[i]}_lkp`);
    }
//console.log(lk_Tables[0]);

//récupèration de la colonne (id) sous forme de liste 
const stmt1 = db.prepare('select distinct(?) from oa_trf_src ;');
const param = stmt.run(`${columnNames[i]}`);
const id = stmt1.raw().all();
//console.log(id);


// pour automatiser les étapes ci-dessus
/*
//récupèration des colonnes sous forme de liste 
for (i = 0; i < columnNames.length; i++){
    const stmt = db.prepare('select distinct(?) from oa_trf_src ;');
    const param = stmt.run(`${columnNames[i]}`);
    const id = param.raw().all();
    //...
}
*/


//création des tables lookup 
lookup = db.prepare(`CREATE TABLE ${lk_Tables[0]} (ID INTEGER PRIMARY KEY AUTOINCREMENT, champ)`); 
lookup.run()

//Inserting data in the table 'lookup'
const insertData = db.prepare(`INSERT INTO ${lk_Tables[0]} (champ) VALUES (@champ);`);

const list_id = db.transaction((lookup) => {
    for(const lk of lookup) insertData.run(lk);
});

// création d'une liste qui contient un entier par valeur de id
for ( let iter = 0; iter < id.length; iter++){
    list_id.push({champ : id[iter][0]});
}

//console.log(lk_Tables[0]);
//console.log(list_id);



/*
list_id([
    { champ: 'ocor_own.tg_harvest_project_detail_aiu' }, 
    ...  
]);

*/
