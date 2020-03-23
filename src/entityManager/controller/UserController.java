package entityManager.controller;

import java.util.List;

import entityManager.repository.*;
import entityManager.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("entity/user")
public class UserController {

	@Autowired
	private UserRepository userService;
	
	@GetMapping(path="/list", produces = "application/json; charset=UTF-8")
	public List<User> list() {
		List<User> listUser = (List<User>) userService.findAll();		
		return listUser;
	}

	@GetMapping(path="/search", produces = "application/json; charset=UTF-8")
	public List<User> search() {
		String param="Usuario";
		List<User> listUser = (List<User>) userService.search(param);		
		System.out.println(listUser);
		return listUser;
	}	
	
    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String redirect() {
        return "redirect:/views/index.html";
    }
	
}
