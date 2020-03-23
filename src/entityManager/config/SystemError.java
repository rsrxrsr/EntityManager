package entityManager.config;

public class SystemError extends Exception {
    
    //
	private static final long serialVersionUID = -4050003083230790884L;
	//

	private String codigoError;
    
    public SystemError(String codigoError){
        super();
        this.codigoError=codigoError;
    }
     
    @Override
    public String getMessage(){
    	return "Error en metodo de Bd: " + this.codigoError;             
    }
     
}