package entityManager.repository;

import org.springframework.data.repository.CrudRepository;
import entityManager.model.Empresa;

public interface EmpresaRepository extends CrudRepository<Empresa, Long> {}
