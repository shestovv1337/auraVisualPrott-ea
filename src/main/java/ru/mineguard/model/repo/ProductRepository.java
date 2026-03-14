package ru.mineguard.model.repo;

import org.springframework.data.repository.CrudRepository;
import ru.mineguard.model.Product;

public interface ProductRepository extends CrudRepository<Product, Long> {
    Product findByName(String name);

    Product findByDescription(String description);

}
