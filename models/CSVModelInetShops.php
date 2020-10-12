<?php

require_once(dirname(dirname(__FILE__)).'/controllers/PDOController.php');

class CSVModel{
    private $_pdo;
    function __construct(){       
        $this->_pdo = new PDOController;       
    }

    public function countDBData(){
        $query = 'SELECT COUNT(id) AS c_rows FROM inet_shops';
        $rows_count = $this->_pdo->fetchColQuery($this->_pdo->getConnection(), $query);               
        return  $rows_count;
    }

    public function getDBData(){
        $query = 'SELECT * FROM inet_shops';
        $result = $this->_pdo->getQuery($this->_pdo->getConnection(), $query);               
        return  $result;
    }

    public function getDBDataRow($id){       
        $params[':id'] = $id;
        $query = 'SELECT * FROM inet_shops WHERE id =:id';
        $result = $this->_pdo->executeQuery($this->_pdo->getConnection(), $query, $params);              
        return  $result;
    }

    // public function getPointsByName($slug){      
    //     $params[':city'] = $slug;
    //     $query = "SELECT * FROM `inet_shops` WHERE `city` =:city";
    //     $result = $this->_pdo->executeQuery($this->_pdo->getConnection(), $query, $params);         
    //     return  $result;
    // }

    public function getPoints(){    
        $query = "SELECT * FROM `inet_shops`";
        $result = $this->_pdo->getQuery($this->_pdo->getConnection(), $query);         
        return  $result;
    }

    public function updateDBRow(string $table_name, array $params, int $row_id){

        $params_string = "";
        

        if(!empty($params)){

            foreach($params as $key=>$value){

                $params_string .= "`".$key."`='".$value."',";

            }

            $params_string = substr($params_string,0,strlen($params_string)-1);           

        }        

        $query = "UPDATE $table_name SET $params_string WHERE `id` =:id";       

        $rows_count = $this->_pdo->runPrepQuery($this->_pdo->getConnection(), $query, [':id'=>$row_id]);

        return $rows_count;        
        
    }

    
    public function CSVtoDB(array $data){       

        foreach($data[0] as $key=>$value){

            $keys_array[] = $key;
        }

        $keys_string = implode(',', $keys_array);        

        $query = 'INSERT INTO `inet_shops`('.$keys_string.') VALUES';        

        $values_string = "";

        foreach($data as $row){

            foreach ($keys_array as $key=>$value){

                if($key == 0){

                    $values_string .= "('".$row[$value]."',";

                }

                elseif($key == (count($keys_array) - 1)){
                    
                    $values_string .= "'".$row[$value]."'),";

                }

                else{

                    $values_string .= "'".$row[$value]."',";
                } 

            }

        }       
        
       $query .= substr($values_string,0,strlen($values_string)-1);        
       
       try{        

            if(!$rows_count = $this->_pdo->runQuery($this->_pdo->getConnection(), $query)){

                throw new Exception('Unsuccessful CSV to DB import attempt!');
            }
           
            return $rows_count;               
        }

       catch(Exception $ex){

            echo $ex->getMessage();
       }
      
    }

}