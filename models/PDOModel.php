<?php

class PDOModel{
    
    public function fetchColQuery($pdo, $query){

        $stmt = $pdo->prepare($query); 

        $stmt->execute();

        $result = $stmt->fetchColumn();        
         
        return $result;
    }

    public function getQuery($pdo, $query){
        $result = array();
        $stmt = $pdo->query($query);
        while ($row = $stmt->fetch()){
            $result[] = $row;
        }
        return $result;
    }

    public function runQuery($pdo, $query){
        $stmt = $pdo->prepare($query);        
        $stmt->execute();          
        return $stmt->rowCount();  
    }


    public function runPrepQuery(PDO $pdo, string $query, array $params){
        $result = array(); 
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $params[':id']);        
        $stmt->execute();          
        return $stmt->rowCount();
    }


    public function executeQuery(PDO $pdo, string $query, array $params){                
        $result = array();         
        $rows = array();       
        $stmt = $pdo->prepare($query);
        foreach($params as $params_key=>$params_value){
            $stmt->bindParam($params_key, $params_value);
        }      
        $stmt->execute();          
        while($row = $stmt->fetch()){
            $rows[] =  $row;
        }
		return $rows;
    }


    public function executeWildQuery($sql, array $params) {
                
        $stmt = $this->dbc->prepare($sql);        

        $stmt -> execute($params);

        $rows = [];
        
        while($row = $stmt->fetch()){

            $rows[] =  $row;
        }
               
		return $rows;
    }
}