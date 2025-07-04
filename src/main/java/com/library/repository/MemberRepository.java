package com.library.repository;

import com.library.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(Long userId);
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);
}
