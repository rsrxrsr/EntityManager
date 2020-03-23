package entityManager.model;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Data;

/**
 * Entity implementation class for Entity: Empresa
 *
 */

@Data
@Entity
public class Empresa implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String empresa;
	private String rollEmpresa;
	
}
