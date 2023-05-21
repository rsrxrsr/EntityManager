package entityManager.controller;

import java.util.List;

import entityManager.repository.*;
import entityManager.config.SystemError;
import entityManager.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

/*
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
*/

@CrossOrigin(origins = {"http://localhost:8100", "http://localhost:8200"})
@RestController
@RequestMapping("entity/empresa")
public class EmpresaController {

	@Autowired
	private EmpresaRepository entityService;
	
    // FindOne
    @GetMapping("/findOne/{id}")
    Empresa findOne(@PathVariable Long id) { //@PathVariable @Min(1) Long id
    	System.out.println("id = " + id);
    		return entityService.findById(id) . orElseThrow();
    }
	
	@GetMapping(path="/list", produces = "application/json; charset=UTF-8")
	List<Empresa> findAll() {
		return (List<Empresa>) entityService.findAll();		
	}
	
	@PostMapping("/save")
	@ResponseStatus(HttpStatus.CREATED)
	Empresa save(@RequestBody Empresa empresa) {
		System.out.println(empresa);
		return entityService.save(empresa);
	}
	
	@DeleteMapping("/delete/{id}")
    void delete(@PathVariable Long id) {
		System.out.println("id = " + id);
        entityService.deleteById(id);
    }
	
	/*
	
	@RequestMapping(value = "/deleted", method = RequestMethod.PUT)
	public Empresa deleteEntity(@RequestBody Empresa empresa) {
		System.out.println(empresa);
		Long id = empresa.getId();
		entityService.deleteById(id);
		return empresa;
	}
	
	@RequestMapping("/edit")
	public ModelAndView editCustomerForm(@RequestParam long id) {
		ModelAndView mav = new ModelAndView("edit_customer");
		Customer customer = customerService.get(id);
		mav.addObject("customer", customer);		
		return mav;
	}
   Edit
	*/
	
}
